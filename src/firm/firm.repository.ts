import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Firm } from './entities/firm.entity';


@Injectable()
export class FirmRepository {
  constructor(
    @InjectRepository(Firm) private readonly repo: Repository<Firm>,
  ) {}

  async create(createFirmDto: {
    userIds?: number[];
    name: string;
    description: string;
    requestIds?: number[];
  }): Promise<Firm> {
    const firm = this.repo.create(createFirmDto);
    return await this.repo.save(firm);
  }

  async findAll(): Promise<Firm[]> {
    return await this.repo.find({ relations: ['contacts'] });
  }

  async findOne(id: number): Promise<Firm | null> {
    return await this.repo.findOne({ where: { id }, relations: ['contacts'] });
  }

  async findOneByName(name: string): Promise<Firm | null> {
    return await this.repo.findOne({
      where: { name },
      relations: ['contacts'],
    });
  }

  async update(
    id: number,
    updateFirmDto: {
      name?: string;
      description?: string;
      userIds?: number[];
      requestIds?: number[];
    },
  ): Promise<Firm | null> {
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
