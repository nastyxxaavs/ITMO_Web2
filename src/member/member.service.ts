import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Position, TeamMember } from './entities/member.entity';
import { TeamMemberRepository } from './member.repository';
import { TeamMemberDto } from './dto/member.dto';
import { FirmRepository } from '../firm/firm.repository';
import { ServiceRepository } from '../service/service.repository';
import { Service } from '../service/entities/service.entity';


@Injectable()
export class MemberService {
  constructor(private readonly teamMemberRepository: TeamMemberRepository,
              private readonly firmRepository: FirmRepository,
              @Inject(forwardRef(() => ServiceRepository))
              private serviceRepository: ServiceRepository) {}


  private mapToDto(member: TeamMember): {
    firstName: string;
    lastName: string;
    requestId: number;
    firmName: string;
    id: number;
    position: Position;
    serviceNames: Promise<string[]>
  } {
    const serviceIds = member.services?.map((service: Service) => service.id);
    const serviceNames = this?.getServiceNamesByIds(serviceIds);
    return {
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      position: member.position,
      firmName: member.firm?.name,
      serviceNames: serviceNames,
      requestId: member.requests?.id,
    };
  }

  async getFirmIdByName(firmName: string): Promise<number | null> {
    const firm = await this.firmRepository.findOneByName(firmName);
    return firm ? firm.id : null;
  }

  private async getServiceIdsByNames(serviceNames: string[]): Promise<number[]> {
    const services = await this.serviceRepository.findIdByName(serviceNames)
    return services.map(service => service.id);
  }

  private async getServiceNamesByIds(serviceIds: number[]): Promise<string[]> {
    const services = await this.serviceRepository.findNameById(serviceIds)
    return services.map(service => service.name);
  }

  async create(createMemberDto: CreateMemberDto): Promise<TeamMember> {
    // const firmId = createMemberDto.firmName
    //   ? await this.getFirmIdByName(createMemberDto.firmName)
    //   : null;
    // if (!firmId) {
    //   throw new NotFoundException('Firm not found');
    // }
    // console.log(firmId);

    // const serviceIds = createMemberDto.serviceNames
    //   ? await this.getServiceIdsByNames(createMemberDto.serviceNames)
    //   : [];

    return this.teamMemberRepository.create({
      firstName: createMemberDto.firstName,
      lastName: createMemberDto.lastName,
      position: createMemberDto.position,
      firmId: 1,
      //serviceIds: serviceIds,
      //requestId: createMemberDto.requestId,
    });
  }

  async findAll():Promise<{
    firstName: string;
    lastName: string;
    requestId: number;
    firmName: string;
    id: number;
    position: Position;
    serviceNames: Promise<string[]>
  }[]> {
    const members = await this.teamMemberRepository.findAll();
    return members.map(this.mapToDto);
  }

  async findOne(id: number): Promise<{
    firstName: string;
    lastName: string;
    requestId: number;
    firmName: string;
    id: number;
    position: Position;
    serviceNames: Promise<string[]>
  } | null> {
    const member = await this.teamMemberRepository.findOne(id);
    return member ? this.mapToDto(member) : null;
  }

  async update(id: number, updateMemberDto: UpdateMemberDto): Promise<boolean> {
    if (await this.teamMemberRepository.existById(id)) {
      // const firmId = updateMemberDto.firmName
      //   ? await this.getFirmIdByName(updateMemberDto.firmName)
      //   : null;
      // if (!firmId) {
      //   throw new NotFoundException('Firm not found');
      // }

      // const serviceIds = updateMemberDto.serviceNames
      //   ? await this.getServiceIdsByNames(updateMemberDto.serviceNames)
      //   : [];

      await this.teamMemberRepository.update(id, {
        firstName: updateMemberDto.firstName,
        lastName: updateMemberDto.lastName,
        position: updateMemberDto.position,
        firmId: 1,
        //serviceIds,
        //requestId: updateMemberDto.requestId,
      });
      return  true;
    }
    return false;
  }

  async remove(id: number): Promise<boolean> {
    if (await this.teamMemberRepository.existById(id)){
      await this.teamMemberRepository.remove(id);
      return true;
    }
    return false;
  }
}
