import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get, Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { ClientRequestDto } from './dto/request.dto';
import { ClientRequestEntity, Status } from './entities/request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { FirmService } from '../firm/firm.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContactDto } from '../contact/dto/contact.dto';
import { NotFoundResponse } from '../common/response';
import { FirmDto } from '../firm/dto/firm.dto';
import { CreateContactDto } from '../contact/dto/create-contact.dto';
import { UpdateContactDto } from '../contact/dto/update-contact.dto';

@ApiTags('requests')
@Controller()
export class RequestsApiController {
  constructor(private readonly requestsService: RequestsService, private readonly firmService: FirmService) {}

  @Get('/api/requests')
  @ApiResponse({
    status: 200,
    description: 'Requests was found.',
    type: [ClientRequestDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Requests not found',
    type: NotFoundResponse,
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 3,
    @Headers('host') host: string,
  ): Promise<{
    total: number;
    links: string | null;
    requests: {
      firmId: number | undefined;
      contactInfo: string;
      clientName: string;
      requestDate: Date;
      id: number;
      userId: number | undefined;
      teamMemberName: string | undefined;
      serviceRequested: string | undefined;
      status: Status
    }[];
    page: number
  }> {
    const skip = (page - 1) * limit;
    const [requests, total] = await this.requestsService.findAllWithPagination(
      skip,
      limit,
    );

    if (!requests) {
      throw new NotFoundException('No requests found');
    }

    const totalPages = Math.ceil(total / limit);
    const prevPage = page > 1 ? `${host}/api/requests?page=${page - 1}&limit=${limit}` : null;
    const nextPage = page < totalPages ? `${host}/api/requests?page=${page + 1}&limit=${limit}` : null;

    const linkHeader: string[] = [];
    if (prevPage) {
      linkHeader.push(`<${prevPage}>; rel="prev"`);
    }
    if (nextPage) {
      linkHeader.push(`<${nextPage}>; rel="next"`);
    }

    return {
      requests,
      total,
      page,
      links: linkHeader.length ? linkHeader.join(', ') : null,
    };
  }

  @Get('/api/requests/:id')
  @ApiOperation({ summary: 'Get a request by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'The request ID' })
  @ApiResponse({
    status: 200,
    description: 'The request was found.',
    type: ClientRequestDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Request not found',
    type: NotFoundResponse,
  })
  async findOne(@Param('id') id: number): Promise<{
    firmId: number | undefined;
    contactInfo: string;
    clientName: string;
    requestDate: Date;
    id: number;
    userId: number | undefined;
    teamMemberName: string | undefined;
    serviceRequested: string | undefined;
    status: Status
  }> {
    const request = await this.requestsService.findOne(id);
    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
    return request;
  }


  @Get('/api/requests/:id/firm')
  @ApiOperation({ summary: 'Get a request`s firm by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'The request ID' })
  @ApiResponse({
    status: 200,
    description: 'The firm was found.',
    type: FirmDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Firm not found',
    type: NotFoundResponse,
  })
  async findFirmForRequest(@Param('id') id: number): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  }> {
    const request = await this.requestsService.findOne(id);
    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }

    const firmId = request.firmId;
    const firm = await this.firmService.findOne(firmId);
    if (!firm) {
      throw new NotFoundException(`No firm associated with request ID ${id}`);
    }
    return firm;
  }


  @Post('/api/request-add')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new request' })
  @ApiBody({ type: CreateRequestDto })
  @ApiResponse({
    status: 201,
    description: 'The request has been successfully created.',
    type: ClientRequestDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async create(
    @Body(ValidationPipe) createRequestsDto: CreateRequestDto,
  ): Promise<ClientRequestEntity> {
    try {
      return await this.requestsService.create(createRequestsDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }


  @Patch('/api/request-edit/:id')
  @ApiOperation({ summary: 'Update an existing request' })
  @ApiParam({ name: 'id', type: Number, description: 'The request ID' })
  @ApiBody({ type: UpdateRequestDto })
  @ApiResponse({
    status: 200,
    description: 'The request has been successfully updated.',
    type: ClientRequestDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Request not found',
    type: NotFoundResponse,
  })
  async update(
    @Param('id') id: number,
    @Body(ValidationPipe) updateRequestDto: UpdateRequestDto,
  ): Promise<{
    firmId: number | undefined;
    contactInfo: string;
    clientName: string;
    requestDate: Date;
    id: number;
    userId: number | undefined;
    teamMemberName: string | undefined;
    serviceRequested: string | undefined;
    status: Status
  }> {
    const updatedRequest = await this.requestsService.apiUpdate(
      id,
      updateRequestDto,
    );
    if (!updatedRequest) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
    return updatedRequest;
  }


  @Delete('/api/request-delete/:id')
  @ApiOperation({ summary: 'Delete an existing request' })
  @ApiParam({ name: 'id', type: Number, description: 'The request ID' })
  @ApiResponse({
    status: 204,
    description: 'The request has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Request not found',
    type: NotFoundResponse,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    const removed = await this.requestsService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
  }
}
