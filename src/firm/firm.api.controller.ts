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
import { FirmService } from './firm.service';
import { FirmDto } from './dto/firm.dto';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundResponse } from '../response';

@ApiTags('firm')
@Controller()
export class FirmApiController {
  constructor(private readonly firmService: FirmService) {}

  @Get('/api/firms')
  @ApiResponse({
    status: 200,
    description: 'Firms was found.',
    type: [FirmDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Firms not found',
    type: NotFoundResponse,
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 3,
    @Headers('host') host: string,
  ): Promise<{
    total: number;
    links: string | null;
    firms: {
      contactId: number[] | undefined;
      userIds: number[] | undefined;
      name: string;
      description: string;
      id: number;
      requestIds: number[] | undefined;
    }[];
    page: number;
  }> {
    const skip = (page - 1) * limit;
    const [firms, total] = await this.firmService.findAllWithPagination(
      skip,
      limit,
    );

    if (!firms) {
      throw new NotFoundException('No firms found');
    }

    const totalPages = Math.ceil(total / limit);
    const prevPage =
      page > 1 ? `${host}/api/firms?page=${page - 1}&limit=${limit}` : null;
    const nextPage =
      page < totalPages
        ? `${host}/api/firms?page=${page + 1}&limit=${limit}`
        : null;

    const linkHeader: string[] = [];
    if (prevPage) {
      linkHeader.push(`<${prevPage}>; rel="prev"`);
    }
    if (nextPage) {
      linkHeader.push(`<${nextPage}>; rel="next"`);
    }

    return {
      firms,
      total,
      page,
      links: linkHeader.length ? linkHeader.join(', ') : null,
    };
  }

  @Get('/api/firms/:id')
  @ApiOperation({ summary: 'Get a firm by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'The firm ID' })
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
  async findOne(@Param('id') id: number): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined;
  }> {
    const firm = await this.firmService.findOne(id);
    if (!firm) {
      throw new NotFoundException(`Firm with ID ${id} not found`);
    }
    return firm;
  }

  @Post('/api/firm-add')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new firm' })
  @ApiBody({ type: CreateFirmDto })
  @ApiResponse({
    status: 201,
    description: 'The firm has been successfully created.',
    type: FirmDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async create(
    @Body(ValidationPipe) createFirmDto: CreateFirmDto,
  ): Promise<FirmDto> {
    try {
      return await this.firmService.create(createFirmDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch('/api/firm-edit/:id')
  @ApiOperation({ summary: 'Update an existing firm' })
  @ApiParam({ name: 'id', type: Number, description: 'The firm ID' })
  @ApiBody({ type: UpdateFirmDto })
  @ApiResponse({
    status: 200,
    description: 'The firm has been successfully updated.',
    type: FirmDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Firm not found',
    type: NotFoundResponse,
  })
  async update(
    @Param('id') id: number,
    @Body(ValidationPipe) updateFirmDto: UpdateFirmDto,
  ): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined;
  }> {
    const updatedFirm = await this.firmService.apiUpdate(id, updateFirmDto);
    if (!updatedFirm) {
      throw new NotFoundException(`Firm with ID ${id} not found`);
    }
    return updatedFirm;
  }

  @Delete('/api/firm-delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an existing firm' })
  @ApiParam({ name: 'id', type: Number, description: 'The firm ID' })
  @ApiResponse({
    status: 204,
    description: 'The firm has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Firm not found',
    type: NotFoundResponse,
  })
  async remove(@Param('id') id: number): Promise<void> {
    const removed = await this.firmService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Firm with ID ${id} not found`);
    }
  }
}
