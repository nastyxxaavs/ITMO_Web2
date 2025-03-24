import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { ClientRequestEntity, Status } from './entities/request.entity';
import { RequestsRepository } from './request.repository';
import { ServiceRepository } from '../service/service.repository';
import { Position, TeamMember } from '../member/entities/member.entity';
import { Category } from '../service/entities/service.entity';
import { MemberRepository } from '../member/member.repository';

@Injectable()
export class RequestsService {
  constructor(private readonly requestRepository: RequestsRepository,
              private readonly serviceRepository: ServiceRepository,
              private readonly teamMemberRepository: MemberRepository,) {}

  private mapToDto(request: ClientRequestEntity): {
    firmId: number;
    contactInfo: string;
    clientName: string;
    requestDate: Date;
    id: number;
    userId: number;
    teamMemberName: string;
    serviceRequested: string;
    status: Status
  } {
    return {
      serviceRequested: request.serviceRequested.name,
      id: request.id,
      clientName: request.clientName,
      contactInfo: request.contactInfo,
      requestDate: request.requestDate,
      status: request.status,
      firmId: request.firm.id,
      userId: request.users.id,
      teamMemberName: request.teamMembers.firstName.concat(request.teamMembers.lastName),
    };
  }

  private async getServiceIdByName(name: string): Promise<number | null> {
    const service = await this.serviceRepository.findOneByName(name);
    return service ? service.id : null;
  }

  private async giveMember(createRequestDto: CreateRequestDto): Promise<TeamMember | null> {
    const service = await this.serviceRepository.findOneByName(createRequestDto.serviceRequested)
    if (!service) {
      return null;
    }
    let teamMember: TeamMember | null = null;

    switch (service.category) {
      case Category['Арбитраж/третейские суды']:
        teamMember = await this.teamMemberRepository.findOneByPosition(Position['Руководитель практики'])
        break;

      case Category['Споры с таможней']:
        teamMember = await this.teamMemberRepository.findOneByPosition(Position['Ведущий юрист'])
        break;

      case Category['Трудовые споры']:
        teamMember = await this.teamMemberRepository.findOneByPosition(Position['Младший юрист'])
        break;

      case Category['Контракты']:
        teamMember = await this.teamMemberRepository.findOneByPosition(Position['Главный бухгалтер'])
        break;

      case Category['Локализация бизнеса']:
        teamMember = await this.teamMemberRepository.findOneByPosition(Position['Генеральный директор'])
        break;

      case Category['Консультирование сельхозпроизводителей']:
        teamMember = await this.teamMemberRepository.findOneByPosition(Position['Помощник юриста'])
        break;

      default:
        return null;
    }

    return teamMember;
  }



  async create(
    createRequestDto: CreateRequestDto): Promise<ClientRequestEntity> {
    //const request = new CreateRequestDto();
    const serviceRequestedId = createRequestDto.serviceRequested
      ? await this.getServiceIdByName(createRequestDto.serviceRequested)
      : null;
    const teamMember = this.giveMember(createRequestDto);
    return this.requestRepository.create({
      clientName: createRequestDto.clientName,
      contactInfo: createRequestDto.contactInfo,
      requestDate: new Date(),
      status: Status['В процессе'],
      serviceRequestedId,
      teamMember,
      }
    );
  }

  async findAll(): Promise<{
    firmId: number;
    contactInfo: string;
    clientName: string;
    requestDate: Date;
    id: number;
    userId: number;
    teamMemberName: string;
    serviceRequested: string;
    status: Status
  }[]> {
    const requestEntities = await this.requestRepository.findAll();
    return requestEntities.map(this.mapToDto);
  }

  async findOne(id: number): Promise<{
    firmId: number;
    contactInfo: string;
    clientName: string;
    requestDate: Date;
    id: number;
    userId: number;
    teamMemberName: string;
    serviceRequested: string;
    status: Status
  } | null> {
    const request = await this.requestRepository.findOne(id);
    return request ? this.mapToDto(request) : null;
  }

  async update(
    id: number,
    updateRequestDto: UpdateRequestDto,
  ): Promise<boolean> {
    if (await this.requestRepository.existById(id)) {
      const serviceRequestedId = updateRequestDto.serviceRequested
        ? await this.getServiceIdByName(updateRequestDto.serviceRequested)
        : null;

      await this.requestRepository.update(id, {
        clientName: updateRequestDto.clientName,
        contactInfo: updateRequestDto.contactInfo,
        status: Status['В процессе'],
        serviceRequestedId
      });
      return true;
    }
    return false;
  }

  async remove(id: number): Promise<boolean> {
    if (await this.requestRepository.existById(id)) {
      await this.requestRepository.remove(id);
      return true;
    }
    return false;
  }
}
