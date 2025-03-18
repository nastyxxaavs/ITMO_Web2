import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { ClientRequestEntity } from './entities/request.entity';
import { RequestsRepository } from './request.repository';
import { ClientRequestDto } from './dto/request.dto';
import { request } from 'express';

@Injectable()
export class RequestsService {
  constructor(private readonly requestRepository: RequestsRepository) {}

  private mapToDto(request: ClientRequestEntity): ClientRequestDto {
    return {
      serviceRequestedId: request.serviceRequested.id,
      id: request.id,
      clientName: request.clientName,
      contactInfo: request.contactInfo,
      requestDate: request.requestDate,
      status: request.status
    };
  }

  async create(createRequestDto: CreateRequestDto): Promise<ClientRequestEntity> {
    return this.requestRepository.create(createRequestDto);
  }

  async findAll():Promise<ClientRequestDto[]> {
    const requestEntities = await this.requestRepository.findAll();
    return requestEntities.map(this.mapToDto);
  }

  async findOne(id: number): Promise<ClientRequestDto | null> {
    const request = await this.requestRepository.findOne(id);
    return request ? this.mapToDto(request) : null;
  }

  async update(id: number, updateRequestDto: UpdateRequestDto): Promise<boolean> {
    if (await this.requestRepository.existById(id)) {
      await this.requestRepository.update(id, updateRequestDto);
      return  true;
    }
    return false;
  }

  async remove(id: number): Promise<boolean> {
    if (await this.requestRepository.existById(id)){
      await this.requestRepository.remove(id);
      return true;
    }
    return false;
  }
}
