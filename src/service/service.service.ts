import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Category, Service } from './entities/service.entity';
import { ServiceRepository } from './service.repository';
import { TeamMemberRepository } from '../member/member.repository';
import { TeamMember } from '../member/entities/member.entity';
import { ContactDto } from '../contact/dto/contact.dto';
import { ServiceDto } from './dto/service.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceRepository: ServiceRepository,
              @Inject(forwardRef(() => TeamMemberRepository))
              private teamMemberRepository: TeamMemberRepository,
              @Inject(CACHE_MANAGER) private cacheManager: Cache,) {}

  private mapToDto(service: Service): {
    firmId: number | undefined;
    price: number;
    requestId: number | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    category: Category
  } {
    const memberIds = service.teamMembers?.map((member: TeamMember) => member.id);
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,
      firmId: service.firm?.id,
      requestId: service.requests?.id,
      userIds: service.users?.map(user => user.id),
    };
  }

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    return this.serviceRepository.create({
      name: createServiceDto.name,
      description: createServiceDto.description,
      category: createServiceDto.category,
      price: createServiceDto.price,
    });
  }

  async findAll():Promise<{
    firmId: number | undefined;
    price: number;
    requestId: number | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    category: Category
  }[]> {
    const services = await this.serviceRepository.findAll();
    if (!services) {
      throw new NotFoundException(`Services are not found`);
    }
    return services.map(this.mapToDto);
  }


  async findAllWithPagination(
    skip: number,
    take: number,
  ): Promise<[ServiceDto[], number]> {
    const cacheKey = `services-page-${skip}-${take}`;
    const cached = await this.cacheManager.get<[ServiceDto[], number]>(cacheKey);
    if (cached) {
      console.log('✅ From cache:', cacheKey);
      return cached;
    }

    const [services, total] =
      await this.serviceRepository.findAllWithPagination(skip, take);
    const mappedServices = services.map(this.mapToDto);

    await this.cacheManager.set(cacheKey, [mappedServices, total], 60);
    console.log('📦 Not from cache (fetched from DB):', cacheKey);

    return [mappedServices, total];
  }


  async findOne(id: number): Promise<{
    firmId: number | undefined;
    price: number;
    requestId: number | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    category: Category
  } | null> {
    const service = await this.serviceRepository.findOne(id);
    if (!service){
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service ? this.mapToDto(service) : null;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto): Promise<boolean> {
    if (await this.serviceRepository.existById(id)) {
      await this.serviceRepository.update(id, {
        name: updateServiceDto.name,
        description: updateServiceDto.description,
        category: updateServiceDto.category,
        price: updateServiceDto.price,
      });
      return true;
    }
    return false;
  }


  async apiUpdate(id: number, updateServiceDto: UpdateServiceDto): Promise<ServiceDto | null> {
    if (await this.serviceRepository.existById(id)) {
      await this.serviceRepository.update(id, {
        name: updateServiceDto.name,
        description: updateServiceDto.description,
        category: updateServiceDto.category,
        price: updateServiceDto.price,
      });
      const service = await this.serviceRepository.findOne(id);
      return service ? this.mapToDto(service) : null;
    }
    throw new NotFoundException(`Service with ID ${id} not found`);
  }

  async remove(id: number): Promise<boolean> {
    if (await this.serviceRepository.existById(id)){
      await this.serviceRepository.remove(id);
      await this.cacheManager.clear();
      return true;
    }
    throw new NotFoundException(`Service with ID ${id} not found`);
  }
}
