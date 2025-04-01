import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { ContactRepository } from './contact.repository';
import { ContactDto } from './dto/contact.dto';
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
      firmId: contact.firm.id
    };
  }

  async getFirmIdByName(firmName: string): Promise<number | null> {
    const firm = await this.firmRepository.findOneByName(firmName);
    return firm ? firm.id : null;
  }


  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const firmId = createContactDto.firmName
      ? await this.getFirmIdByName(createContactDto.firmName)
      : null;
    if (!firmId) {
      throw new NotFoundException('Firm not found');
    }
    console.log(firmId);

    const contact=  this.contactRepository.create({
      address: createContactDto.address,
      phone: createContactDto.phone,
      email: createContactDto.email,
      mapsLink: createContactDto.mapsLink,
      firmId: firmId,
    });
    console.log('Contact being saved:', contact);

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
      const firmId = updateContactDto.firmName
        ? await this.getFirmIdByName(updateContactDto.firmName)
        : null;
      if (!firmId) {
        throw new NotFoundException('Firm not found');
      }
      await this.contactRepository.update(id, {
        address: updateContactDto.address,
        phone: updateContactDto.phone,
        email: updateContactDto.email,
        mapsLink: updateContactDto.mapsLink,
        firmId: firmId,
      });
      return  true;
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
