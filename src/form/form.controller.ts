// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   ValidationPipe,
//   HttpCode,
//   HttpStatus,
// } from '@nestjs/common';
// import { FormService } from './form.service';
// import { CreateSubmissionDto } from './dto/create-form.dto';
// import { UpdateFormDto } from './dto/update-form.dto';
//
// @Controller('forms')
// export class FormController {
//   constructor(private readonly formService: FormService) {}
//
//   @Post()
//   @HttpCode(HttpStatus.CREATED)
//   async create(@Body(ValidationPipe) createFormDto: CreateSubmissionDto): Promise<{ statusCode: number; message: string }> {
//     try {
//       await this.formService.create(createFormDto);
//       return {
//         statusCode: HttpStatus.CREATED,
//         message: 'Submission successfully created',
//       };
//     } catch (error) {
//       return {
//         statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
//         message: 'Error saving submission',
//       };
//     }
//   }
//
//   @Get()
//   findAll() {
//     return this.formService.findAll();
//   }
//
//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.formService.findOne(+id);
//   }
//
//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
//     return this.formService.update(+id, updateFormDto);
//   }
//
//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.formService.remove(+id);
//   }
// }
//
//
