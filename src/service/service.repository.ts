import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category, Service } from './entities/service.entity';
import { FindOperator, In, Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { TeamMember } from '../member/entities/member.entity';
import { Contact } from '../contact/entities/contact.entity';

@Injectable()
export class ServiceRepository {
  constructor(
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
  ) {}

  async create(createServiceDto: {
    price: number;
    name: string;
    description: string;
    category: Category;
  }): Promise<Service> {
    const service = this.serviceRepo.create(createServiceDto);
    return await this.serviceRepo.save(service);
  }

  async findAll(): Promise<Service[]> {
    return await this.serviceRepo.find();
  }

  async findAllWithPagination(skip: number, take: number): Promise<[Service[], number]> {
    return this.serviceRepo.findAndCount({
      skip,
      take,
    });
  }

  async findOne(id: number): Promise<Service | null> {
    return await this.serviceRepo.findOne({ where: { id } });
  }

  async findOneByName(name: string): Promise<Service | null> {
    return await this.serviceRepo.findOne({ where: { name } });
  }

  async update(
    id: number,
    updateServiceDto: {
      price: number | undefined;
      name: string | undefined;
      description: string | undefined;
      category: Category | undefined;
    },
  ): Promise<Service | null> {
    await this.serviceRepo.update(id, updateServiceDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.serviceRepo.delete(id);
  }

  async existById(id: number): Promise<boolean> {
    return !!(await this.serviceRepo.findOne({ where: { id } }));
  }
}
