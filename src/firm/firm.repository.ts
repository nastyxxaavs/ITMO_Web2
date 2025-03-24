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
    serviceIds: number[];
    teamMemberIds: number[];
    contactId: number | null;
    userIds: number[] | undefined;
    name: string;
    description: string;
    requestIds: number[] | undefined;
  }): Promise<Firm> {
    const firm = this.repo.create(createFirmDto);
    return await this.repo.save(firm);
  }

  async findAll(): Promise<Firm[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Firm | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findOneByName(name: string): Promise<Firm | null> {
    return await this.repo.findOne({ where: { name } });
  }

  async update(
    id: number,
    updateFirmDto: {
      serviceIds: number[];
      teamMemberIds: number[];
      contactId: number | null;
      userIds: number[] | undefined;
      name: string | undefined;
      description: string | undefined;
      requestIds: number[] | undefined;
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
