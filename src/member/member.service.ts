import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { TeamMember } from './entities/member.entity';
import { MemberRepository } from './member.repository';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async create(createMemberDto: CreateMemberDto): Promise<TeamMember> {
    return this.memberRepository.create(createMemberDto);
  }

  async findAll():Promise<TeamMember[]> {
    return this.memberRepository.findAll();
  }

  async findOne(id: number): Promise<TeamMember | null> {
    return this.memberRepository.findOne(id);
  }

  async update(id: number, updateMemberDto: UpdateMemberDto): Promise<TeamMember| null> {
    return this.memberRepository.update(id, updateMemberDto);
  }

  async remove(id: number): Promise<void> {
    await this.memberRepository.remove(id);
  }
}
