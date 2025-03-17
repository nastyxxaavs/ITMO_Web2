import { Injectable } from '@nestjs/common';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { Firm } from './entities/firm.entity';
import { FirmRepository } from './firm.repository';

@Injectable()
export class FirmService {
  constructor(private readonly firmRepository: FirmRepository) {}

  async create(createFirmDto: CreateFirmDto): Promise<Firm> {
    return this.firmRepository.create(createFirmDto);
  }

  async findAll():Promise<Firm[]> {
    return this.firmRepository.findAll();
  }

  async findOne(id: number): Promise<Firm | null> {
    return this.firmRepository.findOne(id);
  }

  async update(id: number, updateFirmDto: UpdateFirmDto): Promise<Firm | null> {
    return this.firmRepository.update(id, updateFirmDto);
  }

  async remove(id: number): Promise<void> {
    await this.firmRepository.remove(id);
  }
}
