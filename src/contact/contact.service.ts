import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactDto } from './dto/contact.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { Firm } from '../firm/entities/firm.entity';
import { Contact } from './entities/contact.entity';
import { ContactRepository } from './contact.repository';
import { FirmRepository } from '../firm/firm.repository';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly firmRepository: FirmRepository) {}

  private mapToDto(contact: Contact): ContactDto {
    return {
      id: contact.id,
      address: contact.address,
      phone: contact.phone,
      email: contact.email,
      mapsLink: contact.mapsLink,
      firmId: contact.firm?.id
    };
  }

  async getFirmByName(firmName: string): Promise<Firm | null> {
    return await this.firmRepository.findOneByName(firmName);
  }

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const firm = createContactDto.firmName
      ? await this.getFirmByName(createContactDto.firmName)
      : null;
    if (createContactDto.firmName && !firm) {
      throw new NotFoundException('Firm not found');
    }

    const contact = this.contactRepository.create({
      address: createContactDto.address,
      phone: createContactDto.phone,
      email: createContactDto.email,
      mapsLink: createContactDto.mapsLink,
      firm: firm,
    });

    return contact;
  }

  async findAll(): Promise<ContactDto[]> {
    const contacts = await this.contactRepository.findAll();
    return contacts.map(this.mapToDto);
  }

  async findOne(id: number): Promise<ContactDto | null> {
    const contact = await this.contactRepository.findOne(id);
    return contact ? this.mapToDto(contact) : null;
  }

  async update(id: number, updateContactDto: UpdateContactDto): Promise<boolean> {
    if (await this.contactRepository.existById(id)) {
      const firm = updateContactDto?.firmName
        ? await this.getFirmByName(updateContactDto.firmName)
        : null;
      if (updateContactDto.firmName && !firm) {
        throw new NotFoundException('Firm not found');
      }

      await this.contactRepository.update(id, {
        address: updateContactDto.address,
        phone: updateContactDto.phone,
        email: updateContactDto.email,
        mapsLink: updateContactDto.mapsLink,
        firm: firm,
      });
      return true;
    }
    return false;
  }

  async remove(id: number): Promise<boolean> {
    if (await this.contactRepository.existById(id)){
      await this.contactRepository.remove(id);
      return true;
    }
    return false;
  }
}