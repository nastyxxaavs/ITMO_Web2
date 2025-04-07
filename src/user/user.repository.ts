import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'typeorm/util/StringUtils';
import { Contact } from '../contact/entities/contact.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(createUserDto);
    //user.password = hash(user.password);
    user.password = '12345';
    return await this.userRepo.save(user);
  }

  async findAll():Promise<User[]> {
    return await this.userRepo.find();
  }

  async findAllWithPagination(skip: number, take: number): Promise<[User[], number]> {
    return this.userRepo.findAndCount({
      skip,
      take,
    });
  }

  async findOne(id: number): Promise<User | null> {
    return await this.userRepo.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.userRepo.update(id, updateUserDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }

  async existById(id: number): Promise<boolean> {
    return !!(await this.userRepo.findOne({ where: { id } }));
  }
}
