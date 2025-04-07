import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class RequestsService {
  constructor(
    private readonly clientRequestEntityRepository: ClientRequestEntityRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly teamMemberRepository: TeamMemberRepository,
  ) {}

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
      case Category['Арбитраж/третейские суды']:
        teamMember = await this.teamMemberRepository.findOneByPosition(
          Position['Руководитель практики'],
        );
        break;

      case Category['Споры с таможней']:
        teamMember = await this.teamMemberRepository.findOneByPosition(
          Position['Ведущий юрист'],
        );
        break;

      case Category['Трудовые споры']:
        teamMember = await this.teamMemberRepository.findOneByPosition(
          Position['Младший юрист'],
        );
        break;

      case Category['Контракты']:
        teamMember = await this.teamMemberRepository.findOneByPosition(
          Position['Главный бухгалтер'],
        );
        break;

      case Category['Локализация бизнеса']:
        teamMember = await this.teamMemberRepository.findOneByPosition(
          Position['Генеральный директор'],
        );
        break;

      case Category['Консультирование сельхозпроизводителей']:
        teamMember = await this.teamMemberRepository.findOneByPosition(
          Position['Помощник юриста'],
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
    const [contacts, total] =
      await this.clientRequestEntityRepository.findAllWithPagination(skip, take);
    return [contacts.map(this.mapToDto), total];
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
      return true;
    }
    return false;
  }
}
