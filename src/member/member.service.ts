import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Position, TeamMember } from './entities/member.entity';
import { TeamMemberRepository } from './member.repository';
import { FirmRepository } from '../firm/firm.repository';
import { ServiceRepository } from '../service/service.repository';
import { Firm } from '../firm/entities/firm.entity';
import { TeamMemberDto } from './dto/member.dto';
import { Contact } from '../contact/entities/contact.entity';
import { ContactDto } from '../contact/dto/contact.dto';
import { Repository } from 'typeorm';
import { FirmService } from '../firm/firm.service';

@Injectable()
export class MemberService {
  constructor(
    private readonly teamMemberRepository: TeamMemberRepository,
    private readonly firmRepository: FirmRepository,
    @Inject(forwardRef(() => ServiceRepository))
    private serviceRepository: ServiceRepository,
    private memberRepo: Repository<TeamMember>,
    private readonly  firmService: FirmService,
  ) {}

  private mapToDto(member: TeamMember): {
    firstName: string;
    lastName: string;
    requestId: number | undefined;
    firmName: string | undefined;
    id: number;
    position: Position;
  } {
    return {
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      position: member.position,
      firmName: member.firm?.name,
      requestId: member.requests?.id,
    };
  }

  async getFirmByName(firmName: string): Promise<Firm | null> {
    return await this.firmRepository.findOneByName(firmName);
  }


  async create(createMemberDto: CreateMemberDto): Promise<TeamMember> {
    const firm = createMemberDto.firmName
      ? await this.getFirmByName(createMemberDto.firmName)
      : null;
    if (createMemberDto.firmName && !firm) {
      throw new NotFoundException('Firm not found');
    }
    return this.teamMemberRepository.create({
      firstName: createMemberDto.firstName,
      lastName: createMemberDto.lastName,
      position: createMemberDto.position,
      firm: firm,

    });
  }

  async findAll(): Promise<TeamMemberDto[]
  > {
    const members = await this.teamMemberRepository.findAll();
    if (!members){
      throw new NotFoundException(`Members are not found`);
    }
    return members.map(this.mapToDto);
  }

  async findAllWithPagination(
    skip: number,
    take: number,
  ): Promise<[TeamMemberDto[], number]> {
    const [members, total] =
      await this.teamMemberRepository.findAllWithPagination(skip, take);
    return [members.map(this.mapToDto), total];
  }

  async findOne(id: number): Promise< TeamMemberDto| null> {
    const member = await this.teamMemberRepository.findOne(id);
    if (!member){
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
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

      await this.teamMemberRepository.update(id, {
        firstName: updateMemberDto.firstName,
        lastName: updateMemberDto.lastName,
        position: updateMemberDto.position,
        firm: firm,

      });
      return true;
    }
    throw new NotFoundException(`Member with ID ${id} not found`);
  }

  async apiUpdate(id: number, updateMemberDto: UpdateMemberDto): Promise<TeamMemberDto | null> {
    if (await this.teamMemberRepository.existById(id)) {
      const firm = updateMemberDto.firmName
        ? await this.getFirmByName(updateMemberDto.firmName)
        : null;
      if (updateMemberDto.firmName && !firm) {
        throw new NotFoundException('Firm not found');
      }

      await this.teamMemberRepository.update(id, {
        firstName: updateMemberDto.firstName,
        lastName: updateMemberDto.lastName,
        position: updateMemberDto.position,
        firm: firm,

      });
      const member = await this.teamMemberRepository.findOne(id);
      return member ? this?.mapToDto(member) : null;
    }
    throw new NotFoundException(`Member with ID ${id} not found`);
  }

  async remove(id: number): Promise<boolean> {
    if (await this.teamMemberRepository.existById(id)) {
      await this.teamMemberRepository.remove(id);
      return true;
    }
    throw new NotFoundException(`Member with ID ${id} not found`);
  }

  async assignFirm(memberId: number, firmName: string): Promise<TeamMember> {
    const member = await this.findOne(memberId);
    if (!member) throw new Error('Member not found');

    const firm = await this.firmService.findOneByName(firmName);
    if (!firm) throw new Error('Firm not found');

    member.firmName = firm.name;
    return this.memberRepo.save(member);
  }

  async removeFirm(memberId: number): Promise<TeamMember> {
    const member = await this.findOne(memberId);
    if (!member) throw new Error('Member not found');

    member.firmName = '';
    return this.memberRepo.save(member);
  }

}
