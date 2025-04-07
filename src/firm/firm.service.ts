import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { Firm } from './entities/firm.entity';
import { FirmRepository } from './firm.repository';
import { ServiceRepository } from '../service/service.repository';
import { TeamMemberRepository } from '../member/member.repository';
import { ContactRepository } from '../contact/contact.repository';
import { FirmDto } from './dto/firm.dto';

@Injectable()
export class FirmService {
  constructor(
    private readonly firmRepository: FirmRepository,
  ) {}

  private mapToDto(firm: Firm): {
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  } {

    return {
      id: firm.id,
      name: firm.name,
      description: firm.description,
      contactId: firm.contacts?.map((contact) => contact.id),
      requestIds: firm.requests?.map((clientRequest) => clientRequest.id),
      userIds: firm.requests?.map((user) => user.id),
    };
  }



  async create(createFirmDto: CreateFirmDto): Promise<Firm> {

    return this.firmRepository.create({
      name: createFirmDto.name,
      description: createFirmDto.description,
      userIds: createFirmDto.userIds,
      requestIds: createFirmDto.requestIds,
    });
  }

  async findAll(): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  }[]> {
    const firms = await this.firmRepository.findAll();
    return firms.map(this.mapToDto);
  }

  async findAllWithPagination(skip: number, take: number): Promise<[{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  }[], number]> {
    const [firms, total] = await this.firmRepository.findAllWithPagination(skip, take);
    return [firms.map(this.mapToDto), total];
  }

  async findOne(id: number): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  } | null> {
    const firm = await this.firmRepository.findOne(id);
    return firm ? this.mapToDto(firm) : null;
  }

  async update(id: number, updateFirmDto: UpdateFirmDto): Promise<boolean> {
    if (await this.firmRepository.existById(id)) {

      await this.firmRepository.update(id, {
        name: updateFirmDto.name,
        description: updateFirmDto.description,
        userIds: updateFirmDto.userIds,
        requestIds: updateFirmDto.requestIds,
      });
      return true;
    }
    return false;
  }

  async apiUpdate(id: number, updateFirmDto: UpdateFirmDto): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  } | null> {
    if (await this.firmRepository.existById(id)) {
      await this.firmRepository.update(id, {
        name: updateFirmDto.name,
        description: updateFirmDto.description,
        userIds: updateFirmDto.userIds,
        requestIds: updateFirmDto.requestIds,
      });
      const firm = await this.firmRepository.findOne(id);
      return firm ? this.mapToDto(firm) : null;
    }
    throw new NotFoundException(`Firm with ID ${id} not found`);
  }


  async remove(id: number): Promise<boolean> {
    if (await this.firmRepository.existById(id)) {
      await this.firmRepository.remove(id);
      return true;
    }
    return false;
  }
}
