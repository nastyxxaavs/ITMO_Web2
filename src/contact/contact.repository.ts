import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ContactRepository {
  constructor(
    @InjectRepository(Contact) private readonly repo: Repository<Contact>,
  ) {}

  async create(createContactDto: {
    address: string;
    phone: string;
    mapsLink: string;
    firmId: number;
    email: string;
  }): Promise<Contact> {
    const contact = this.repo.create(createContactDto);
    return await this.repo.save(contact);
  }

  async findAll(): Promise<Contact[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Contact | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findOneByName(phone: string): Promise<Contact | null> {
    return await this.repo.findOne({ where: { phone } });
  }

  async update(
    id: number,
    updateContactDto: {
      firmId: number;
      address: string | undefined;
      phone: string | undefined;
      mapsLink: string | undefined;
      email: string | undefined;
    },
  ): Promise<Contact | null> {
    await this.repo.update(id, updateContactDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async existById(id: number): Promise<boolean> {
    return !!(await this.repo.findOne({ where: { id } }));
  }
}
