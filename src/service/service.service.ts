import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceService {
  constructor(@InjectRepository(Service) private serviceRepo: Repository<Service>) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = this.serviceRepo.create(createServiceDto);
    return await this.serviceRepo.save(service);
  }

  async findAll():Promise<Service[]> {
    return await this.serviceRepo.find();
  }

  async findOne(id: number): Promise<Service | null> {
    return await this.serviceRepo.findOne({ where: { id } });
  }

  async update(id: number, updateServiceDto: UpdateServiceDto): Promise<Service | null> {
    await this.serviceRepo.update(id, updateServiceDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.serviceRepo.delete(id);
  }
}
