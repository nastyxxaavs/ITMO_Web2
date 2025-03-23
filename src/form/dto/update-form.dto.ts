import { PartialType } from '@nestjs/mapped-types';
import { CreateSubmissionDto } from './create-form.dto';

export class UpdateFormDto extends PartialType(CreateSubmissionDto) {}
