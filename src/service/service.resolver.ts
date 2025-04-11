import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ServiceService } from './service.service';
import { ServiceDto } from './dto/service.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { FirmService } from '../firm/firm.service';
import { FirmDto } from '../firm/dto/firm.dto';
import { NotFoundException } from '@nestjs/common';
import { Service } from './dto/service_gql.output';
import { PaginatedServices } from './dto/paginatec-service_gql.output';
import { Firm } from '../firm/dto/firm_gql.output';

@Resolver(() => Service)
export class ServiceResolver {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly firmService: FirmService,
  ) {}


  @Query(() => PaginatedServices, { name: 'getServices' })
  async getServices(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 3 }) limit: number,
  ): Promise<Service[]> {
    const skip = (page - 1) * limit;
    const [services, total] = await this.serviceService.findAllWithPagination(skip, limit);

    if (!services || total === 0) {
      throw new NotFoundException('No services found');
    }
    return services;
  }


  @Query(() => Service, { name: 'getService' })
  async getService(@Args('id', { type: () => Int }) id: number): Promise<Service> {
    const service = await this.serviceService.findOne(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }


  @Query(() => Firm, { name: 'getServiceFirm' })
  async getServiceFirm(@Args('id', { type: () => Int }) id: number) {
    const service = await this.serviceService.findOne(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    const firm = await this.firmService.findOne(service.firmId);
    if (!firm) {
      throw new NotFoundException(`No firm associated with service ID ${id}`);
    }

    return firm;
  }


  @Mutation(() => Service)
  async createService(
    @Args('createServiceInput') createServiceInput: CreateServiceDto,
  ): Promise<Service> {
    return this.serviceService.create(createServiceInput);
  }


  @Mutation(() => Service)
  async updateService(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateServiceInput') updateServiceInput: UpdateServiceDto,
  ): Promise<Service> {
    const updatedService = await this.serviceService.apiUpdate(id, updateServiceInput);
    if (!updatedService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return updatedService;
  }


  @Mutation(() => Boolean)
  async removeService(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    const removed = await this.serviceService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return true;
  }
}
