import { Injectable } from '@nestjs/common';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Firm } from './entities/firm.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FirmService {
  constructor(@InjectRepository(Firm) private firmRepo: Repository<Firm>) {}

  async create(createFirmDto: CreateFirmDto): Promise<Firm> {
    const firm = this.firmRepo.create(createFirmDto);
    return await this.firmRepo.save(firm);
  }

  async findAll():Promise<Firm[]> {
    return await this.firmRepo.find();
  }

  async findOne(id: number): Promise<Firm | null> {
    return await this.firmRepo.findOne({ where: { id } });
  }

  async update(id: number, updateFirmDto: UpdateFirmDto): Promise<Firm | null> {
    await this.firmRepo.update(id, updateFirmDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.firmRepo.delete(id);
  }
}
