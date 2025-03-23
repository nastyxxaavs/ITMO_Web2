import { Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Submission } from './entities/form.entity';
import { SubmissionRepository } from './form.repository';


@Injectable()
export class FormService {
  constructor(private readonly formRepository: SubmissionRepository) {}

  create(createFormDto: CreateSubmissionDto): Promise<Submission>  {
    return this.formRepository.create({
      name: createFormDto.name,
      email: createFormDto.email,
    });
  }

  findAll() {
    return `This action returns all form`;
  }

  findOne(id: number) {
    return `This action returns a #${id} form`;
  }

  update(id: number, updateFormDto: UpdateFormDto) {
    return `This action updates a #${id} form`;
  }

  remove(id: number) {
    return `This action removes a #${id} form`;
  }
}




