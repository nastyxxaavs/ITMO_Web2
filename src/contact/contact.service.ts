import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { ContactRepository } from './contact.repository';

@Injectable()
export class ContactService {
  constructor(private readonly contactRepository: ContactRepository) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    return this.contactRepository.create(createContactDto);
  }

  async findAll(): Promise<Contact[]> {
    return this.contactRepository.findAll();
  }

  async findOne(id: number): Promise<Contact | null> {
    return this.contactRepository.findOne(id);
  }

  async update(id: number, updateContactDto: UpdateContactDto): Promise<Contact | null> {
    return this.contactRepository.update(id, updateContactDto);
  }

  async remove(id: number): Promise<void> {
    return this.contactRepository.remove(id);
  }
}
