import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { ClientRequestEntity, Status } from './entities/request.entity';
import { ClientRequestEntityRepository } from './request.repository';
import { ServiceRepository } from '../service/service.repository';
import { Position, TeamMember } from '../member/entities/member.entity';
import { Category } from '../service/entities/service.entity';
import { TeamMemberRepository } from '../member/member.repository';
import { ContactDto } from '../contact/dto/contact.dto';
import { ClientRequestDto } from './dto/request.dto';
import { Observable, Subject } from 'rxjs';
import { Repository } from 'typeorm';
import { ClientRequest } from './dto/request_gql.output';
import { Firm } from '../firm/dto/firm_gql.output';
import { FirmRepository } from '../firm/firm.repository';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RequestsService {
  private eventStream = new Subject<any>();
  constructor(
    private readonly clientRequestEntityRepository: ClientRequestEntityRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly teamMemberRepository: TeamMemberRepository,
    private readonly firmRepository: FirmRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  getEventStream(): Observable<any> {
    return this.eventStream.asObservable();
  }

  notifyRequestChange(message: string): void {
    console.log('Sending SSE:', message);
    this.eventStream.next({ message });
  }

  private mapToDto(request: ClientRequestEntity): {
    firmId: number | undefined;
    contactInfo: string;
    clientName: string;
    requestDate: Date;
    id: number;
    userId: number | undefined;
    teamMemberName: string | undefined;
    serviceRequested: string | undefined;
    status: Status
  } {
    return {
      serviceRequested: request.serviceRequested?.name,
      id: request.id,
      clientName: request.clientName,
      contactInfo: request.contactInfo,
      requestDate: request.requestDate,
      status: request.status,
      firmId: request.firm?.id,
      userId: request.users?.id,
      teamMemberName: request.teamMembers?.firstName.concat(
        request.teamMembers.lastName,
      ),
    };
  }


  async transformToGraphQL(clientRequestEntity: ClientRequestEntity): Promise<{
    firm: Promise<Firm | null>;
    firmId: number | undefined;
    contactInfo: string;
    clientName: string;
    requestDate: Date;
    id: number;
    userId: number | undefined;
    teamMemberName: string | undefined;
    serviceRequested: string | undefined;
    status: Status
  }> {
    return {
      id: clientRequestEntity.id,
      clientName: clientRequestEntity.clientName,
      contactInfo: clientRequestEntity.contactInfo,
      serviceRequested: clientRequestEntity.serviceRequested?.name ,
      requestDate: clientRequestEntity.requestDate,
      status: clientRequestEntity.status,
      firmId: clientRequestEntity.firm?.id,
      userId: clientRequestEntity.users?.id,
      teamMemberName: clientRequestEntity.teamMembers?.firstName.concat(
        clientRequestEntity.teamMembers.lastName),
      firm: this.firmRepository.findOne(clientRequestEntity.firm?.id),
    };
  }


  private async getServiceIdByName(name: string): Promise<number | null> {
    const service = await this.serviceRepository.findOneByName(name);
    return service ? service.id : null;
  }

  private async giveMember(
    createRequestDto: CreateRequestDto,
  ): Promise<TeamMember | null> {
    const service = await this.serviceRepository.findOneByName(
      createRequestDto.serviceRequested,
    );
    if (!service) {
      return null;
    }
    let teamMember: TeamMember | null = null;

    switch (service.category) {
      case Category['ARBITRATION']:
        teamMember = await this.teamMemberRepository.findOneByPosition(
          Position['PRACTICE_HEAD'],
        );
        break;

      case Category['CUSTOMS_DISPUTES']:
        teamMember = await this.teamMemberRepository.findOneByPosition(
          Position['SENIOR_LAWYER'],
        );
        break;

      case Category['LABOR_DISPUTES']:
        teamMember = await this.teamMemberRepository.findOneByPosition(
          Position['JUNIOR_LAWYER'],
        );
        break;

      case Category['CONTRACTS']:
        teamMember = await this.teamMemberRepository.findOneByPosition(
          Position['CHIEF_ACCOUNTANT'],
        );
        break;

      case Category['BUSINESS_LOCALIZATION']:
        teamMember = await this.teamMemberRepository.findOneByPosition(
          Position['CEO'],
        );
        break;

      case Category['AGRICULTURE_CONSULTING']:
        teamMember = await this.teamMemberRepository.findOneByPosition(
          Position['LEGAL_ASSISTANT'],
        );
        break;

      default:
        return null;
    }

    return teamMember;
  }

  async create(
    createRequestDto: CreateRequestDto,
  ): Promise<ClientRequestEntity> {
    const serviceRequestedId = createRequestDto.serviceRequested
      ? await this.getServiceIdByName(createRequestDto.serviceRequested)
      : null;
    const teamMember = this.giveMember(createRequestDto);
    return this.clientRequestEntityRepository.create({
      clientName: createRequestDto.clientName,
      contactInfo: createRequestDto.contactInfo,
      requestDate: new Date(),
      status: Status.IN_PROGRESS,
      serviceRequestedId,
      teamMember,
    });
  }

  async findAll(): Promise<{
    firmId: number | undefined;
    contactInfo: string;
    clientName: string;
    requestDate: Date;
    id: number;
    userId: number | undefined;
    teamMemberName: string | undefined;
    serviceRequested: string | undefined;
    status: Status
  }[]> {
    const requestEntities = await this.clientRequestEntityRepository.findAll();
    if (!requestEntities){
      throw new NotFoundException(`Requests are not found`);
    }
    return requestEntities.map(this.mapToDto);
  }


  async findAllWithPagination(
    skip: number,
    take: number,
  ): Promise<[{
    firmId: number | undefined;
    contactInfo: string;
    clientName: string;
    requestDate: Date;
    id: number;
    userId: number | undefined;
    teamMemberName: string | undefined;
    serviceRequested: string | undefined;
    status: Status
  }[], number]> {
    const cacheKey = `requests-page-${skip}-${take}`;

    const cached = await this.cacheManager.get<[ReturnType<typeof this.mapToDto>[], number]>(cacheKey);
    if (cached) {
      console.log('✅ From cache:', cacheKey);
      return cached;
    }

    const [requests, total] =
      await this.clientRequestEntityRepository.findAllWithPagination(skip, take);
    const mapped = requests.map(this.mapToDto);

    await this.cacheManager.set(cacheKey, [mapped, total], 60);
    console.log('📦 Not from cache (fetched from DB):', cacheKey);

    return [mapped, total];
  }


  async findOne(id: number): Promise<{
    firmId: number | undefined;
    contactInfo: string;
    clientName: string;
    requestDate: Date;
    id: number;
    userId: number | undefined;
    teamMemberName: string | undefined;
    serviceRequested: string | undefined;
    status: Status
  } | null> {
    const request = await this.clientRequestEntityRepository.findOne(id);
    if (!request){
      throw new NotFoundException(`Request with ID ${id} not found`);
    }
    return request ? this.mapToDto(request) : null;
  }

  async update(
    id: number,
    updateRequestDto: UpdateRequestDto,
  ): Promise<boolean> {
    if (await this.clientRequestEntityRepository.existById(id)) {

      await this.clientRequestEntityRepository.update(id, {
        clientName: updateRequestDto.clientName,
        contactInfo: updateRequestDto.contactInfo,
        status: Status['В процессе'],
      });
      return true;
    }
    return false;
  }

  async apiUpdate(
    id: number,
    updateRequestDto: UpdateRequestDto,
  ): Promise<{
    firmId: number | undefined;
    contactInfo: string;
    clientName: string;
    requestDate: Date;
    id: number;
    userId: number | undefined;
    teamMemberName: string | undefined;
    serviceRequested: string | undefined;
    status: Status
  } | null> {
    if (await this.clientRequestEntityRepository.existById(id)) {

      await this.clientRequestEntityRepository.update(id, {
        clientName: updateRequestDto.clientName,
        contactInfo: updateRequestDto.contactInfo,
        status: Status['В процессе'],
      });
      const request = await this.clientRequestEntityRepository.findOne(id);
      return request ? this.mapToDto(request) : null;
    }
    throw new NotFoundException(`Request with ID ${id} not found`);
  }

  async remove(id: number): Promise<boolean> {
    if (await this.clientRequestEntityRepository.existById(id)) {
      await this.clientRequestEntityRepository.remove(id);
      await this.cacheManager.clear();
      return true;
    }
    throw new NotFoundException(`Request with ID ${id} not found`);
  }

  async updateStatus(id: number, status: Status) {
    const request = await this.findOne(id);
    if (!request) {
      return null;
    }

    request.status = status;

    await this.clientRequestEntityRepository.update(id,request);
  }


}
