import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { Firm } from './entities/firm.entity';

@Injectable()
export class FirmRepository {
  constructor(@InjectRepository(Firm) private readonly repo: Repository<Firm>) {}

  async create(createFirmDto: CreateFirmDto): Promise<Firm> {
    const firm = this.repo.create(createFirmDto);
    return await this.repo.save(firm);
  }

  async findAll(): Promise<Firm[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Firm | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async update(id: number, updateFirmDto: UpdateFirmDto): Promise<Firm | null> {
    await this.repo.update(id, updateFirmDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async existById(id: number): Promise<boolean> {
    return !!(await this.repo.findOne({ where: { id } }));
  }
}
