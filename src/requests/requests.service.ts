import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { ClientRequestEntity } from './entities/request.entity';
import { RequestsRepository } from './request.repository';

@Injectable()
export class RequestsService {
  constructor(private readonly requestRepository: RequestsRepository) {}

  async create(createRequestDto: CreateRequestDto): Promise<ClientRequestEntity> {
    return this.requestRepository.create(createRequestDto);
  }

  async findAll():Promise<ClientRequestEntity[]> {
    return this.requestRepository.findAll();
  }

  async findOne(id: number): Promise<ClientRequestEntity | null> {
    return this.requestRepository.findOne(id);
  }

  async update(id: number, updateRequestDto: UpdateRequestDto): Promise<ClientRequestEntity | null> {
    return this.requestRepository.update(id, updateRequestDto);
  }

  async remove(id: number): Promise<void> {
    await this.requestRepository.remove(id);
  }
}
