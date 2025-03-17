import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamMember } from './entities/member.entity';

@Injectable()
export class MemberService {
  constructor(@InjectRepository(TeamMember) private memberRepo: Repository<TeamMember>) {}

  async create(createMemberDto: CreateMemberDto): Promise<TeamMember> {
    const teamMember = this.memberRepo.create(createMemberDto);
    return await this.memberRepo.save(teamMember);
  }

  async findAll():Promise<TeamMember[]> {
    return await this.memberRepo.find();
  }

  async findOne(id: number): Promise<TeamMember | null> {
    return await this.memberRepo.findOne({ where: { id } });
  }

  async update(id: number, updateMemberDto: UpdateMemberDto): Promise<TeamMember| null> {
    await this.memberRepo.update(id, updateMemberDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.memberRepo.delete(id);
  }
}
