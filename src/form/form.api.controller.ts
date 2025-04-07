import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
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
  ): Promise<{ forms: SubmissionDto[]; total: number; page: number }> {
    const skip = (page - 1) * limit;
    const [forms, total] = await this.formService.findAllWithPagination(
      skip,
      limit,
    );

    if (!forms) {
      throw new NotFoundException('No forms found');
    }

    return {
      forms,
      total,
      page,
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
