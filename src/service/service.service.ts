import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';
import { ServiceRepository } from './service.repository';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    return this.serviceRepository.create(createServiceDto);
  }

  async findAll():Promise<Service[]> {
    return this.serviceRepository.findAll();
  }

  async findOne(id: number): Promise<Service | null> {
    return this.serviceRepository.findOne(id);
  }

  async update(id: number, updateServiceDto: UpdateServiceDto): Promise<Service | null> {
    return this.serviceRepository.update(id, updateServiceDto);
  }

  async remove(id: number): Promise<void> {
    await this.serviceRepository.remove(id);
  }
}
