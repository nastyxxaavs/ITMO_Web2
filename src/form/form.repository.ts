import { Submission } from './entities/form.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubmissionDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';

// @EntityRepository(Submission)
// export class SubmissionRepository extends Repository<Submission> {
//   // В случае необходимости можно добавить методы для сложных запросов
// }

@Injectable()
export class SubmissionRepository {
  constructor(@InjectRepository(Submission) private formRepo: Repository<Submission>) {}

  async create(createSubmissionDto: CreateSubmissionDto): Promise<Submission> {
    const form = this.formRepo.create(createSubmissionDto);
    return await this.formRepo.save(form);
  }

  async findAll():Promise<Submission[]> {
    return await this.formRepo.find();
  }

  async findOne(id: number): Promise<Submission | null> {
    return await this.formRepo.findOne({ where: { id } });
  }

  async update(id: number, updateSubmissionDto: UpdateFormDto): Promise<Submission | null> {
    await this.formRepo.update(id, updateSubmissionDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.formRepo.delete(id);
  }

  async existById(id: number): Promise<boolean> {
    return !!(await this.formRepo.findOne({ where: { id } }));
  }
}
