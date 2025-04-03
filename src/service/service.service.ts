import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Category, Service } from './entities/service.entity';
import { ServiceRepository } from './service.repository';
import { TeamMemberRepository } from '../member/member.repository';
import { TeamMember } from '../member/entities/member.entity';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceRepository: ServiceRepository,
              @Inject(forwardRef(() => TeamMemberRepository))
              private teamMemberRepository: TeamMemberRepository) {}

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
    //const teamMemberNames = this?.getMemberNamesByIds(memberIds);
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,
      firmId: service.firm?.id,
      requestId: service.requests?.id,
      //teamMemberNames,
      userIds: service.users?.map(user => user.id),
    };
  }
  //
  // private async getTeamMemberIdsByNames(teamMemberNames: string[]): Promise<number[]> {
  //   const teamMembers = await this.teamMemberRepository.findIdByName(teamMemberNames)
  //   return teamMembers.map(member => member.id);
  // }

  // private async getMemberNamesByIds(memberIds: number[]): Promise<string[]> {
  //   const members = await this.serviceRepository.findNameById(memberIds)
  //   return members.map(member => member.name);
  // }

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    // const teamMemberIds = createServiceDto.teamMemberNames
    //   ? await this.getTeamMemberIdsByNames(createServiceDto.teamMemberNames)
    //   : [];

    return this.serviceRepository.create({
      name: createServiceDto.name,
      description: createServiceDto.description,
      category: createServiceDto.category,
      price: createServiceDto.price,
      //firmId: createServiceDto.firmId,
      //requestId: createServiceDto.requestId,
      //teamMemberIds,
      //userIds: createServiceDto.userIds,
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
    return services.map(this.mapToDto);
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
    return service ? this.mapToDto(service) : null;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto): Promise<boolean> {
    if (await this.serviceRepository.existById(id)) {
    //   const teamMemberIds = updateServiceDto.teamMemberNames
    //     ? await this.getTeamMemberIdsByNames(updateServiceDto.teamMemberNames)
    //     : [];
      await this.serviceRepository.update(id, {
        name: updateServiceDto.name,
        description: updateServiceDto.description,
        category: updateServiceDto.category,
        price: updateServiceDto.price,
        // firmId: updateServiceDto.firmId,
        // requestId: updateServiceDto.requestId,
        // teamMemberIds,
        // userIds: updateServiceDto.userIds,
      });
      return true;
    }
    return false;
  }

  async remove(id: number): Promise<boolean> {
    if (await this.serviceRepository.existById(id)){
      await this.serviceRepository.remove(id);
      return true;
    }
    return false;
  }
}
