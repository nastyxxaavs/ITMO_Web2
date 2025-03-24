import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Position, TeamMember } from './entities/member.entity';
import { FindOperator, In, Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Service } from '../service/entities/service.entity';

@Injectable()
export class MemberRepository {
  constructor(
    @InjectRepository(TeamMember) private memberRepo: Repository<TeamMember>,
  ) {}

  async create(createMemberDto: {
    firstName: string;
    lastName: string;
    firmId: number;
    serviceIds: number[] | undefined;
    requestId: number | undefined;
    position: Position;
  }): Promise<TeamMember> {
    const teamMember = this.memberRepo.create(createMemberDto);
    return await this.memberRepo.save(teamMember);
  }

  async findAll(): Promise<TeamMember[]> {
    return await this.memberRepo.find();
  }

  async findOne(id: number): Promise<TeamMember | null> {
    return await this.memberRepo.findOne({ where: { id } });
  }

  async findOneByPosition(position: Position): Promise<TeamMember | null> {
    return await this.memberRepo.findOne({ where: { position } });
  }

  async findIdByName(names: string[]): Promise<TeamMember[]> {
    return this.find({
      where: {
        name: In(names),
      },
    });
  }

  async findNameById(ids: number[]): Promise<TeamMember[]> {
    return this.findName({
      where: {
        id: In(ids),
      },
    });
  }

  find(arg0: {
    where: { name: FindOperator<any> };
  }): TeamMember[] | PromiseLike<TeamMember[]> {
    throw new Error('Method not implemented.');
  }

  findName(arg0: {
    where: { id: FindOperator<any> };
  }): TeamMember[] | PromiseLike<TeamMember[]> {
    throw new Error('Method not implemented.');
  }

  async update(
    id: number,
    updateMemberDto: {
      firstName: string | undefined;
      lastName: string | undefined;
      firmId: number;
      serviceIds: number[];
      requestId: number | undefined;
      position: Position | undefined;
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
