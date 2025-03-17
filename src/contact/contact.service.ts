import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Firm } from '../firm/entities/firm.entity';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactService {
  constructor(@InjectRepository(Contact) private contactRepo: Repository<Contact>) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepo.create(createContactDto);
    return await this. contactRepo.save(contact);
  }

  async findAll():Promise<Contact[]> {
    return await this.contactRepo.find();
  }

  async findOne(id: number): Promise<Contact | null> {
    return await this.contactRepo.findOne({ where: { id } });
  }

  async update(id: number, updateContactDto: UpdateContactDto): Promise<Contact | null> {
    await this.contactRepo.update(id, updateContactDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.contactRepo.delete(id);
  }
}
