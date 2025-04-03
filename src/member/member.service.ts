import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Position, TeamMember } from './entities/member.entity';
import { TeamMemberRepository } from './member.repository';
import { FirmRepository } from '../firm/firm.repository';
import { ServiceRepository } from '../service/service.repository';
import { Firm } from '../firm/entities/firm.entity';
import { TeamMemberDto } from './dto/member.dto';

@Injectable()
export class MemberService {
  constructor(
    private readonly teamMemberRepository: TeamMemberRepository,
    private readonly firmRepository: FirmRepository,
    @Inject(forwardRef(() => ServiceRepository))
    private serviceRepository: ServiceRepository,
  ) {}

  private mapToDto(member: TeamMember): {
    firstName: string;
    lastName: string;
    requestId: number | undefined;
    firmName: string | undefined;
    id: number;
    position: Position;
  } {
    //const serviceIds = member.services?.map((service: Service) => service.id);
    //const serviceNames = this?.getServiceNamesByIds(serviceIds);
    return {
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      position: member.position,
      firmName: member.firm?.name,
      //serviceNames: serviceNames,
      requestId: member.requests?.id,
    };
  }

  async getFirmByName(firmName: string): Promise<Firm | null> {
    return await this.firmRepository.findOneByName(firmName);
  }

  // private async getServiceIdsByNames(serviceNames: string[]): Promise<number[]> {
  //   const services = await this.serviceRepository.findIdByName(serviceNames)
  //   return services.map(service => service.id);
  // }
  //
  // private async getServiceNamesByIds(serviceIds: number[]): Promise<string[]> {
  //   const services = await this.serviceRepository.findNameById(serviceIds)
  //   return services.map(service => service.name);
  // }

  async create(createMemberDto: CreateMemberDto): Promise<TeamMember> {
    const firm = createMemberDto.firmName
      ? await this.getFirmByName(createMemberDto.firmName)
      : null;
    if (createMemberDto.firmName && !firm) {
      throw new NotFoundException('Firm not found');
    }

    // const serviceIds = createMemberDto.serviceNames
    //   ? await this.getServiceIdsByNames(createMemberDto.serviceNames)
    //   : [];

    return this.teamMemberRepository.create({
      firstName: createMemberDto.firstName,
      lastName: createMemberDto.lastName,
      position: createMemberDto.position,
      firm: firm,
      //serviceIds: serviceIds,
      //requestId: createMemberDto.requestId,
    });
  }

  async findAll(): Promise<TeamMemberDto[]
  > {
    const members = await this.teamMemberRepository.findAll();
    return members.map(this.mapToDto);
  }

  async findOne(id: number): Promise< TeamMemberDto| null> {
    const member = await this.teamMemberRepository.findOne(id);
    return member ? this?.mapToDto(member) : null;
  }

  async update(id: number, updateMemberDto: UpdateMemberDto): Promise<boolean> {
    if (await this.teamMemberRepository.existById(id)) {
      const firm = updateMemberDto.firmName
        ? await this.getFirmByName(updateMemberDto.firmName)
        : null;
      if (updateMemberDto.firmName && !firm) {
        throw new NotFoundException('Firm not found');
      }

      // const serviceIds = updateMemberDto.serviceNames
      //   ? await this.getServiceIdsByNames(updateMemberDto.serviceNames)
      //   : [];

      await this.teamMemberRepository.update(id, {
        firstName: updateMemberDto.firstName,
        lastName: updateMemberDto.lastName,
        position: updateMemberDto.position,
        firm: firm,
        //serviceIds,
        //requestId: updateMemberDto.requestId,
      });
      return true;
    }
    return false;
  }

  async remove(id: number): Promise<boolean> {
    if (await this.teamMemberRepository.existById(id)) {
      await this.teamMemberRepository.remove(id);
      return true;
    }
    return false;
  }
}
