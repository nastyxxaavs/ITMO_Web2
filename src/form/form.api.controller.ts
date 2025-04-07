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
import { FormService } from './form.service';
import { SubmissionDto } from './dto/form.dto';
import { CreateSubmissionDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';


@Controller()
export class FormApiController {
  constructor(private readonly formService: FormService) {}

  @Get('/api/forms')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 3,
    @Headers('host') host: string,
  ): Promise<{ total: number; links: string | null; page: number; forms: SubmissionDto[] }> {
    const skip = (page - 1) * limit;
    const [forms, total] = await this.formService.findAllWithPagination(
      skip,
      limit,
    );

    if (!forms) {
      throw new NotFoundException('No forms found');
    }

    const totalPages = Math.ceil(total / limit);
    const prevPage = page > 1 ? `${host}/api/forms?page=${page - 1}&limit=${limit}` : null;
    const nextPage = page < totalPages ? `${host}/api/forms?page=${page + 1}&limit=${limit}` : null;

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

  @Get('/api/forms/:id')
  async findOne(@Param('id') id: number): Promise<SubmissionDto | null> {
    const form = this.formService.findOne(id);
    if (!form) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
    return form;
  }

  @Post('/api/form-add')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createFormDto: CreateSubmissionDto,
  ): Promise<SubmissionDto> {
    try {
      return await this.formService.create(createFormDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }


  @Patch('/api/form-edit/:id')
  async update(
    @Param('id') id: number,
    @Body(ValidationPipe) updateFormDto: UpdateFormDto,
  ): Promise<SubmissionDto> {
    const updatedForm = await this.formService.apiUpdate(
      id,
      updateFormDto,
    );
    if (!updatedForm) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
    return updatedForm;
  }


  @Delete('/api/form-delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    const removed = await this.formService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
  }
}
