import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { Submission } from './entities/form.entity';
import { SubmissionRepository } from './form.repository';
import { ContactDto } from '../contact/dto/contact.dto';
import { SubmissionDto } from './dto/form.dto';
import { Contact } from '../contact/entities/contact.entity';


@Injectable()
export class FormService {
  constructor(private readonly formRepository: SubmissionRepository) {}

  private mapToDto(form: Submission): SubmissionDto {
    return {
      id: form.id,
      name: form.name,
      email: form.email,
      createdAt: form.createdAt,
    };
  }

  create(createFormDto: CreateSubmissionDto): Promise<Submission>  {
    return this.formRepository.create({
      name: createFormDto.name,
      email: createFormDto.email,
      createdAt: new Date(),
    });
  }

  async findAll(): Promise<SubmissionDto[]> {
    const forms = await this.formRepository.findAll();
    if (!forms){
      throw new NotFoundException(`Forms are not found`);
    }
    return forms.map(this.mapToDto);
  }

  async findAllWithPagination(
    skip: number,
    take: number,
  ): Promise<[SubmissionDto[], number]> {
    const [forms, total] =
      await this.formRepository.findAllWithPagination(skip, take);
    return [forms.map(this.mapToDto), total];
  }

  async findOne(id: number): Promise<SubmissionDto | null> {
    const form = await this.formRepository.findOne(id);
    if (!form){
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
    return form ? this.mapToDto(form) : null;
  }

  async apiUpdate(id: number, updateFormDto: UpdateFormDto) : Promise<SubmissionDto | null> {
    if (await this.formRepository.existById(id)) {

      await this.formRepository.update(id, {
        name: updateFormDto.name,
        email: updateFormDto.email,
      });

      const form = await this.formRepository.findOne(id);
      return form ? this.mapToDto(form) : null;
    }
    throw new NotFoundException(`Form with ID ${id} not found`);
  }


  async remove(id: number): Promise<boolean> {
    if (await this.formRepository.existById(id)) {
      await this.formRepository.remove(id);
      return true;
    }
    throw new NotFoundException(`Form with ID ${id} not found`);
  }
}




