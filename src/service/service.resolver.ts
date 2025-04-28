import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ServiceService } from './service.service';
import { FirmService } from '../firm/firm.service';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { Service } from './dto/service_gql.output';
import { PaginatedServices } from './dto/paginatec-service_gql.output';
import { Firm } from '../firm/dto/firm_gql.output';
import { CreateServiceInput } from './dto/create-service_gql.input';
import { UpdateServiceInput } from './dto/update-service_gql.input';
import { SuperTokensAuthGuard } from 'supertokens-nestjs';


@Resolver(() => Service)
export class ServiceResolver {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly firmService: FirmService,
  ) {}

  @UseGuards(SuperTokensAuthGuard)
  @Query(() => PaginatedServices, { name: 'getServices' })
  async getServices(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 3 }) limit: number,
  ): Promise<Service[]> {
    const skip = (page - 1) * limit;
    const [services, total] = await this.serviceService.findAllWithPagination(
      skip,
      limit,
    );

    if (!services || total === 0) {
      throw new NotFoundException('No services found');
    }
    return services;
  }

  @UseGuards(SuperTokensAuthGuard)
  @Query(() => Service, { name: 'getService' })
  async getService(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Service> {
    const service = await this.serviceService.findOne(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  @UseGuards(SuperTokensAuthGuard)
  @ResolveField(() => Firm, { name: 'firm', nullable: true })
  async getFirm(@Parent() service: Service): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined;
  } | null> {
    if (!service.firmId) return null;

    const firm = await this.firmService.findOne(service.firmId);
    return firm || null;
  }


  @UseGuards(SuperTokensAuthGuard)
  @Mutation(() => Service)
  async createService(
    @Args('createServiceInput') createServiceInput: CreateServiceInput,
  ) {
    return this.serviceService.create(createServiceInput);
  }


  @UseGuards(SuperTokensAuthGuard)
  @Mutation(() => Service)
  async updateService(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateServiceInput') updateServiceInput: UpdateServiceInput,
  ): Promise<Service> {
    const updatedService = await this.serviceService.apiUpdate(
      id,
      updateServiceInput,
    );
    if (!updatedService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return updatedService;
  }


  @UseGuards(SuperTokensAuthGuard)
  @Mutation(() => Boolean)
  async removeService(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    const removed = await this.serviceService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return true;
  }
}
