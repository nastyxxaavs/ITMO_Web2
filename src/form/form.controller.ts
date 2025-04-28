import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FormService } from './form.service';
import { CreateSubmissionDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { PublicAccess } from 'supertokens-nestjs';


@ApiExcludeController()
@Controller()
export class FormController {
  constructor(private readonly formService: FormService) {}

  @PublicAccess()
  @Post('/form-add')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createFormDto: CreateSubmissionDto)  {
    try {
      await this.formService.create(createFormDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Submission successfully created',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error saving submission',
        error: error,
      };
    }
  }

  @Get()
  findAll() {
    return this.formService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    return this.formService.apiUpdate(+id, updateFormDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formService.remove(+id);
  }
}


