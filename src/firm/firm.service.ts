import { Injectable } from '@nestjs/common';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { Firm } from './entities/firm.entity';
import { FirmRepository } from './firm.repository';
import { FirmDto } from './dto/firm.dto';


@Injectable()
export class FirmService {
  constructor(private readonly firmRepository: FirmRepository) {}

  private mapToDto(firm: Firm): FirmDto {
    return {
      id: firm.id,
      name: firm.name,
      description: firm.description,
      contactId: firm.contacts.id
    };
  }

  async create(createFirmDto: CreateFirmDto): Promise<Firm> {
    return this.firmRepository.create({
      name: createFirmDto.name,
      description: createFirmDto.description,
      serviceIds: createFirmDto.serviceIds,
      teamMemberIds: createFirmDto.teamMemberIds,
      userIds: createFirmDto.userIds,
      contactId: createFirmDto.contactId,
      requestIds: createFirmDto.requestIds,
    });
  }

  async findAll():Promise<FirmDto[]> {
    const firms = await this.firmRepository.findAll();
    return firms.map(this.mapToDto);
  }

  async findOne(id: number): Promise<FirmDto | null> {
    const firm = await this.firmRepository.findOne(id);
    return firm ? this.mapToDto(firm) : null;
  }

  async update(id: number, updateFirmDto: UpdateFirmDto): Promise<boolean> {
    if (await this.firmRepository.existById(id)) {
      await this.firmRepository.update(id, {
        name: updateFirmDto.name,
        description: updateFirmDto.description,
        serviceIds: updateFirmDto.serviceIds,
        teamMemberIds: updateFirmDto.teamMemberIds,
        userIds: updateFirmDto.userIds,
        contactId: updateFirmDto.contactId,
        requestIds: updateFirmDto.requestIds,
      });
      return  true;
    }
    return false;
  }

  async remove(id: number): Promise<boolean> {
    if (await this.firmRepository.existById(id)){
      await this.firmRepository.remove(id);
      return true;
    }
    return false;
  }
}
