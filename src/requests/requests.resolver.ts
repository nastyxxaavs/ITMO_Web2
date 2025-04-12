import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { RequestsService } from './requests.service';
import { FirmService } from '../firm/firm.service';
import { FirmDto } from '../firm/dto/firm.dto';
import { NotFoundException } from '@nestjs/common';
import { ClientRequestEntity, Status } from './entities/request.entity';
import { ClientRequest } from './dto/request_gql.output';
import { PaginatedRequests } from './dto/paginated-requests_gql.output';
import { Firm } from '../firm/dto/firm_gql.output';
import { CreateRequestInput } from './dto/create-request_gql.input';
import { UpdateRequestInput } from './dto/update-request_gql.input';
import { Contact } from '../contact/dto/contact_gql.output';

@Resolver(() => ClientRequest)
export class RequestsResolver {
  constructor(
    private readonly requestsService: RequestsService,
    private readonly firmService: FirmService,
  ) {}


  @Query(() => PaginatedRequests, { name: 'getRequests' })
  async getRequests(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 3 }) limit: number,
  ) {
    const skip = (page - 1) * limit;
    const [requests, total] = await this.requestsService.findAllWithPagination(skip, limit);

    if (!requests || total === 0) {
      throw new NotFoundException('No requests found');
    }
    return requests;
  }


  @Query(() => ClientRequest, { name: 'getRequest' })
  async getRequest(@Args('id', { type: () => Int }) id: number){
    const request = await this.requestsService.findOne(id);
    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
    return request;
  }

  //
  // @Query(() => Firm, { name: 'getRequestFirm' })
  // async getRequestFirm(@Args('id', { type: () => Int }) id: number) {
  //   const request = await this.requestsService.findOne(id);
  //   if (!request) {
  //     throw new NotFoundException(`Request with ID ${id} not found`);
  //   }
  //
  //   const firm = await this.firmService.findOne(request.firmId);
  //   if (!firm) {
  //     throw new NotFoundException(`No firm associated with request ID ${id}`);
  //   }
  //
  //   return firm;
  // }


  @ResolveField(() => Firm, { name: 'firm', nullable: true })
  async getFirm(@Parent() request: ClientRequest): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  } | null> {
    if (!request.firmId) return null;

    const firm = await this.firmService.findOne(request.firmId);
    return firm || null;
  }


  @Mutation(() => ClientRequest)
  async createRequest(
    @Args('createRequestInput') createRequestInput: CreateRequestInput,
  ) {
    return this.requestsService.create(createRequestInput);
  }


  @Mutation(() => ClientRequest)
  async updateRequest(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateRequestInput') updateRequestInput: UpdateRequestInput,
  ) {
    const updatedRequest = await this.requestsService.apiUpdate(id, updateRequestInput);
    if (!updatedRequest) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
    return updatedRequest;
  }


  @Mutation(() => Boolean)
  async removeRequest(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    const removed = await this.requestsService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
    return true;
  }


  @Mutation(() => ClientRequest, { name: 'markRequestCompleted' })
  async markRequestCompleted(@Args('id', { type: () => Int }) id: number) {
    const request = await this.requestsService.updateStatus(id, Status.COMPLETED);
    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
    return request;
  }

  @Mutation(() => ClientRequest, { name: 'markRequestInProgress' })
  async markRequestInProgress(@Args('id', { type: () => Int }) id: number) {
    const request = await this.requestsService.updateStatus(id, Status.IN_PROGRESS);
    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
    return request;
  }
}
