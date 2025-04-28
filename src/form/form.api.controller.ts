import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { FormService } from './form.service';
import { SubmissionDto } from './dto/form.dto';
import { CreateSubmissionDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import {
  ApiBody, ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NotFoundResponse } from '../common/response';
import { SuperTokensAuthGuard } from 'supertokens-nestjs';

@ApiTags('form')
@ApiCookieAuth('sAccessToken')
@Controller()
export class FormApiController {
  constructor(private readonly formService: FormService) {}

  @UseGuards(SuperTokensAuthGuard)
  @Get('/api/forms')
  @ApiResponse({
    status: 200,
    description: 'Forms was found.',
    type: [SubmissionDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Forms not found',
    type: NotFoundResponse,
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 3,
    @Headers('host') host: string,
  ): Promise<{
    total: number;
    links: string | null;
    page: number;
    forms: SubmissionDto[];
  }> {
    const skip = (page - 1) * limit;
    const [forms, total] = await this.formService.findAllWithPagination(
      skip,
      limit,
    );

    if (!forms) {
      throw new NotFoundException('No forms found');
    }

    const totalPages = Math.ceil(total / limit);
    const prevPage =
      page > 1 ? `${host}/api/forms?page=${page - 1}&limit=${limit}` : null;
    const nextPage =
      page < totalPages
        ? `${host}/api/forms?page=${page + 1}&limit=${limit}`
        : null;

    const linkHeader: string[] = [];
    if (prevPage) {
      linkHeader.push(`<${prevPage}>; rel="prev"`);
    }
    if (nextPage) {
      linkHeader.push(`<${nextPage}>; rel="next"`);
    }

    return {
      forms,
      total,
      page,
      links: linkHeader.length ? linkHeader.join(', ') : null,
    };
  }

  @UseGuards(SuperTokensAuthGuard)
  @Get('/api/forms/:id')
  @ApiOperation({ summary: 'Get a form by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'The form ID' })
  @ApiResponse({
    status: 200,
    description: 'The form was found.',
    type: SubmissionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Form not found',
    type: NotFoundResponse,
  })
  async findOne(@Param('id') id: number): Promise<SubmissionDto | null> {
    const form = this.formService.findOne(id);
    if (!form) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
    return form;
  }


  @UseGuards(SuperTokensAuthGuard)
  @Post('/api/form-add')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new form' })
  @ApiBody({ type: CreateSubmissionDto })
  @ApiResponse({
    status: 201,
    description: 'The form has been successfully created.',
    type: SubmissionDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async create(
    @Body(ValidationPipe) createFormDto: CreateSubmissionDto,
  ): Promise<SubmissionDto> {
    try {
      return await this.formService.create(createFormDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }


  @UseGuards(SuperTokensAuthGuard)
  @Patch('/api/form-edit/:id')
  @ApiOperation({ summary: 'Update an existing form' })
  @ApiParam({ name: 'id', type: Number, description: 'The form ID' })
  @ApiBody({ type: UpdateFormDto })
  @ApiResponse({
    status: 200,
    description: 'The form has been successfully updated.',
    type: SubmissionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Form not found',
    type: NotFoundResponse,
  })
  async update(
    @Param('id') id: number,
    @Body(ValidationPipe) updateFormDto: UpdateFormDto,
  ): Promise<SubmissionDto> {
    const updatedForm = await this.formService.apiUpdate(id, updateFormDto);
    if (!updatedForm) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
    return updatedForm;
  }


  @UseGuards(SuperTokensAuthGuard)
  @Delete('/api/form-delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an existing form' })
  @ApiParam({ name: 'id', type: Number, description: 'The form ID' })
  @ApiResponse({
    status: 204,
    description: 'The form has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Form not found',
    type: NotFoundResponse,
  })
  async remove(@Param('id') id: number): Promise<void> {
    const removed = await this.formService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
  }
}
