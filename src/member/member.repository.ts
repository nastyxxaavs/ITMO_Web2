import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Position, TeamMember } from './entities/member.entity';
import { Repository } from 'typeorm';
import { Firm } from '../firm/entities/firm.entity';
import { Contact } from '../contact/entities/contact.entity';
import { TeamMemberDto } from './dto/member.dto';

@Injectable()
export class TeamMemberRepository {
  constructor(
    @InjectRepository(TeamMember) private memberRepo: Repository<TeamMember>,
  ) {}

  async save(teamMember: TeamMemberDto): Promise<TeamMember> {
    return await this.memberRepo.save(teamMember);
  }

  async create(createMemberDto: {
    firstName: string;
    lastName: string;
    firm: Firm | null;
    photoUrl: string | undefined;
    position: Position;
  }): Promise<TeamMember> {
    const teamMember = this.memberRepo.create(createMemberDto);
    return await this.memberRepo.save(teamMember);
  }

  async findAll(): Promise<TeamMember[]> {
    return await this.memberRepo.find({ relations: ['firm'] });
  }

  async findAllWithPagination(
    skip: number,
    take: number,
  ): Promise<[TeamMember[], number]> {
    return this.memberRepo.findAndCount({
      skip,
      take,
      relations: ['firm'],
    });
  }

  async findOne(id: number): Promise<TeamMember | null> {
    return await this.memberRepo.findOne({
      where: { id },
      relations: ['firm'],
    });
  }

  async findOneByPosition(position: Position): Promise<TeamMember | null> {
    return await this.memberRepo.findOne({
      where: { position },
      relations: ['firm'],
    });
  }

  async update(
    id: number,
    updateMemberDto: {
      firstName: string | undefined;
      lastName: string | undefined;
      firm: Firm | null;
      position: Position | undefined;
      photoUrl: string | undefined;
    },
  ): Promise<TeamMember | null> {
    await this.memberRepo.update(id, updateMemberDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.memberRepo.delete(id);
  }

  async existById(id: number): Promise<boolean> {
    return !!(await this.memberRepo.findOne({ where: { id } }));
  }
}
