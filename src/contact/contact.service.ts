import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { ContactRepository } from './contact.repository';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly contactRepository: ContactRepository) {}

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

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    return this.contactRepository.create(createContactDto);
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
      await this.contactRepository.update(id, updateContactDto);
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
