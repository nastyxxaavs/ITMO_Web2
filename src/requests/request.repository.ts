import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientRequestEntity, Status } from './entities/request.entity';
import { Repository } from 'typeorm';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { TeamMember } from '../member/entities/member.entity';
import { Contact } from '../contact/entities/contact.entity';

@Injectable()
export class ClientRequestEntityRepository {
  constructor(
    @InjectRepository(ClientRequestEntity)
    private requestRepo: Repository<ClientRequestEntity>,
  ) {}

  async create(createRequestDto: {
    teamMember: Promise<TeamMember | null>;
    contactInfo: string;
    clientName: string;
    requestDate: Date;
    serviceRequestedId: number | null;
    status: Status;
  }): Promise<ClientRequestEntity> {
    const request = this.requestRepo.create(createRequestDto);
    return await this.requestRepo.save(request);
  }

  async findAll(): Promise<ClientRequestEntity[]> {
    return await this.requestRepo.find();
  }

  async findAllWithPagination(skip: number, take: number): Promise<[ClientRequestEntity[], number]> {
    return this.requestRepo.findAndCount({
      skip,
      take,
    });
  }

  async findOne(id: number): Promise<ClientRequestEntity | null> {
    return await this.requestRepo.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateRequestDto: {
      contactInfo: string | undefined;
      clientName: string | undefined;
      status: any;
    },
  ): Promise<ClientRequestEntity | null> {
    await this.requestRepo.update(id, updateRequestDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.requestRepo.delete(id);
  }

  async existById(id: number): Promise<boolean> {
    return !!(await this.requestRepo.findOne({ where: { id } }));
  }
}
