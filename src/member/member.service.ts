import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { TeamMember } from './entities/member.entity';
import { MemberRepository } from './member.repository';
import { TeamMemberDto } from './dto/member.dto';


@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  private mapToDto(member: TeamMember): TeamMemberDto {
    return {
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      position: member.position,
    };
  }

  async create(createMemberDto: CreateMemberDto): Promise<TeamMember> {
    return this.memberRepository.create(createMemberDto);
  }

  async findAll():Promise<TeamMemberDto[]> {
    const members = await this.memberRepository.findAll();
    return members.map(this.mapToDto);
  }

  async findOne(id: number): Promise<TeamMemberDto | null> {
    const member = await this.memberRepository.findOne(id);
    return member ? this.mapToDto(member) : null;
  }

  async update(id: number, updateMemberDto: UpdateMemberDto): Promise<boolean> {
    if (await this.memberRepository.existById(id)) {
      await this.memberRepository.update(id, updateMemberDto);
      return  true;
    }
    return false;
  }

  async remove(id: number): Promise<boolean> {
    if (await this.memberRepository.existById(id)){
      await this.memberRepository.remove(id);
      return true;
    }
    return false;
  }
}
