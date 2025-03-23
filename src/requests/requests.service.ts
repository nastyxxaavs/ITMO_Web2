import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { ClientRequestEntity, Status } from './entities/request.entity';
import { RequestsRepository } from './request.repository';
import { ClientRequestDto } from './dto/request.dto';

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
      status: request.status,
    };
  }

  async create(
    createRequestDto: CreateRequestDto,
  ): Promise<ClientRequestEntity> {
    const request = new ClientRequestDto();
    request.clientName = createRequestDto.clientName;
    request.contactInfo = createRequestDto.contactInfo;
    request.serviceRequestedId = createRequestDto.serviceRequestedId;
    request.requestDate = new Date();
    request.status = Status['В процессе'];
    return this.requestRepository.create(
      request
    );
  }

  async findAll(): Promise<ClientRequestDto[]> {
    const requestEntities = await this.requestRepository.findAll();
    return requestEntities.map(this.mapToDto);
  }

  async findOne(id: number): Promise<ClientRequestDto | null> {
    const request = await this.requestRepository.findOne(id);
    return request ? this.mapToDto(request) : null;
  }

  async update(
    id: number,
    updateRequestDto: UpdateRequestDto,
  ): Promise<boolean> {
    if (await this.requestRepository.existById(id)) {
      const request = new UpdateRequestDto();
      request.clientName = updateRequestDto.clientName;
      request.contactInfo = updateRequestDto.contactInfo;
      request.serviceRequestedId = updateRequestDto.serviceRequestedId;
      await this.requestRepository.update(id, request);
      return true;
    }
    return false;
  }

  async remove(id: number): Promise<boolean> {
    if (await this.requestRepository.existById(id)) {
      await this.requestRepository.remove(id);
      return true;
    }
    return false;
  }
}
