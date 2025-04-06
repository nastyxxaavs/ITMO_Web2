import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Firm } from '../firm/entities/firm.entity';

@Injectable()
export class ContactRepository {
  constructor(
    @InjectRepository(Contact) private readonly repo: Repository<Contact>,
  ) {}

  async create(createContactDto: {
    address: string;
    phone: string;
    email: string;
    mapsLink: string;
    firm: Firm | null;
  }): Promise<Contact> {
    let contact: Contact;
    contact = this.repo.create(createContactDto);
    return await this.repo.save(contact);
  }

  async findAll(): Promise<Contact[]> {
    return await this.repo.find({ relations: ['firm'] });
  }


  async findAllWithPagination(skip: number, take: number): Promise<[Contact[], number]> {
    return this.repo.findAndCount({
      skip,
      take,
    });
  }

  async findOne(id: number): Promise<Contact | null> {
    return await this.repo.findOne({
      where: { id },
      relations: ['firm'],
    });
  }

  async findOneByPhone(phone: string): Promise<Contact | null> {
    return await this.repo.findOne({
      where: { phone },
      relations: ['firm'],
    });
  }

  async update(
    id: number,
    updateContactDto: {
      firm: Firm | null;
      address?: string;
      phone?: string;
      mapsLink?: string;
      email?: string;
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