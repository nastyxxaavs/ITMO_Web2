import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientRequestEntity } from './entities/request.entity';

@Injectable()
export class RequestsService {
  constructor(@InjectRepository(ClientRequestEntity) private requestRepo: Repository<ClientRequestEntity>) {}

  async create(createRequestDto: CreateRequestDto): Promise<ClientRequestEntity> {
    const request = this.requestRepo.create(createRequestDto);
    return await this.requestRepo.save(request);
  }

  async findAll():Promise<ClientRequestEntity[]> {
    return await this.requestRepo.find();
  }

  async findOne(id: number): Promise<ClientRequestEntity | null> {
    return await this.requestRepo.findOne({ where: { id } });
  }

  async update(id: number, updateRequestDto: UpdateRequestDto): Promise<ClientRequestEntity | null> {
    await this.requestRepo.update(id, updateRequestDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.requestRepo.delete(id);
  }
}
