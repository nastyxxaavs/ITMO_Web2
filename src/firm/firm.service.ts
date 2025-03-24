import { Injectable } from '@nestjs/common';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { Firm } from './entities/firm.entity';
import { FirmRepository } from './firm.repository';
import { FirmDto } from './dto/firm.dto';
import { ServiceRepository } from '../service/service.repository';
import { MemberRepository } from '../member/member.repository';
import { ContactRepository } from '../contact/contact.repository';
import { Service } from '../service/entities/service.entity';
import { TeamMember } from '../member/entities/member.entity';



@Injectable()
export class FirmService {
  constructor(
    private readonly firmRepository: FirmRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly teamMemberRepository: MemberRepository,
    private readonly contactRepository: ContactRepository,) {}

  private mapToDto(firm: Firm): {
    contactId: number;
    memberNames: Promise<string[]>;
    userIds: number[];
    name: string;
    description: string;
    id: number;
    requestIds: number[];
    serviceNames: Promise<string[]>
  } {
    const serviceIds = firm.services.map((service: Service) => service.id);
    const serviceNames = this.getServiceNamesByIds(serviceIds);
    const memberIds = firm.teamMembers.map((member: TeamMember) => member.id);
    const memberNames = this.getMemberNamesByIds(memberIds);

    return {
      id: firm.id,
      name: firm.name,
      description: firm.description,
      contactId: firm.contacts.id,
      serviceNames,
      memberNames,
      requestIds: firm.requests.map(clientRequest => clientRequest.id),
      userIds: firm.requests.map(user => user.id),
    };
  }

  private async getServiceIdsByNames(serviceNames: string[]): Promise<number[]> {
    const services = await this.serviceRepository.findIdByName(serviceNames)
    return services.map(service => service.id);
  }

  private async getServiceNamesByIds(serviceIds: number[]): Promise<string[]> {
    const services = await this.serviceRepository.findNameById(serviceIds)
    return services.map(service => service.name);
  }

  private async getMemberNamesByIds(memberIds: number[]): Promise<string[]> {
    const members = await this.serviceRepository.findNameById(memberIds)
    return members.map(member => member.name);
  }

  private async getTeamMemberIdsByNames(teamMemberNames: string[]): Promise<number[]> {
    const teamMembers = await this.teamMemberRepository.findIdByName(teamMemberNames)
    return teamMembers.map(member => member.id);
  }

  private async getContactIdByPhone(contactPhone: string): Promise<number | null> {
    const contact = await this.contactRepository.findOneByName(contactPhone);
    return contact ? contact.id : null;
  }


  async create(createFirmDto: CreateFirmDto): Promise<Firm> {
    const serviceIds = createFirmDto.serviceNames
      ? await this.getServiceIdsByNames(createFirmDto.serviceNames)
      : [];
    const teamMemberIds = createFirmDto.teamMemberNames
      ? await this.getTeamMemberIdsByNames(createFirmDto.teamMemberNames)
      : [];

    const contactId = createFirmDto.contact
      ? await this.getContactIdByPhone(createFirmDto.contact)
      : null;

    return this.firmRepository.create({
      name: createFirmDto.name,
      description: createFirmDto.description,
      serviceIds,
      teamMemberIds,
      userIds: createFirmDto.userIds,
      contactId,
      requestIds: createFirmDto.requestIds,
    });
  }

  async findAll():Promise<{
    contactId: number;
    memberNames: Promise<string[]>;
    userIds: number[];
    name: string;
    description: string;
    id: number;
    requestIds: number[];
    serviceNames: Promise<string[]>
  }[]> {
    const firms = await this.firmRepository.findAll();
    return firms.map(this.mapToDto);
  }

  async findOne(id: number): Promise<{
    contactId: number;
    memberNames: Promise<string[]>;
    userIds: number[];
    name: string;
    description: string;
    id: number;
    requestIds: number[];
    serviceNames: Promise<string[]>
  } | null> {
    const firm = await this.firmRepository.findOne(id);
    return firm ? this.mapToDto(firm) : null;
  }

  async update(id: number, updateFirmDto: UpdateFirmDto): Promise<boolean> {
    if (await this.firmRepository.existById(id)) {
      const serviceIds = updateFirmDto.serviceNames
        ? await this.getServiceIdsByNames(updateFirmDto.serviceNames)
        : [];
      const teamMemberIds = updateFirmDto.teamMemberNames
        ? await this.getTeamMemberIdsByNames(updateFirmDto.teamMemberNames)
        : [];

      const contactId = updateFirmDto.contact
        ? await this.getContactIdByPhone(updateFirmDto.contact)
        : null;
      await this.firmRepository.update(id, {
        name: updateFirmDto.name,
        description: updateFirmDto.description,
        serviceIds,
        teamMemberIds,
        userIds: updateFirmDto.userIds,
        contactId,
        requestIds: updateFirmDto.requestIds,
      });
      return  true;
    }
    return false;
  }

  async remove(id: number): Promise<boolean> {
    if (await this.firmRepository.existById(id)){
      await this.firmRepository.remove(id);
      return true;
    }
    return false;
  }
}
