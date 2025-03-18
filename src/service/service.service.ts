import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';
import { ServiceRepository } from './service.repository';
import { ServiceDto } from './dto/service.dto';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  private mapToDto(service: Service): ServiceDto {
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,

    };
  }

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    return this.serviceRepository.create(createServiceDto);
  }

  async findAll():Promise<ServiceDto[]> {
    //return this.serviceRepository.findAll();
    const services = await this.serviceRepository.findAll();
    return services.map(this.mapToDto);
  }

  async findOne(id: number): Promise<ServiceDto | null> {
    //return this.serviceRepository.findOne(id);
    const service = await this.serviceRepository.findOne(id);
    return service ? this.mapToDto(service) : null;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto): Promise<boolean> {
    //return this.serviceRepository.update(id, updateServiceDto);
    if (await this.serviceRepository.existById(id)) {
      await this.serviceRepository.update(id, updateServiceDto);
      return true;
    }
    return false;
  }

  async remove(id: number): Promise<boolean> {
    //await this.serviceRepository.remove(id);
    if (await this.serviceRepository.existById(id)){
      await this.serviceRepository.remove(id);
      return true;
    }
    return false;
  }
}
