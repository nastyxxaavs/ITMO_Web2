import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthStatus, Role, User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/user.dto';
import { ContactDto } from '../contact/dto/contact.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private mapToDto(user: User): UserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      status: user.status,
      role: user.role,
    };
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      status: createUserDto.status,
      role: createUserDto.role,
    });
  }

  async findAll():Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(this.mapToDto);
  }

  async findAllWithPagination(
    skip: number,
    take: number,
  ): Promise<[UserDto[], number]> {
    const [users, total] =
      await this.userRepository.findAllWithPagination(skip, take);
    return [users.map(this.mapToDto), total];
  }


  async findOne(id: number): Promise<UserDto | null> {
    const user = await this.userRepository.findOne(id);
    return user ? this.mapToDto(user) : null;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<boolean> {
    if (await this.userRepository.existById(id)) {
      await this.userRepository.update(id, {
        username: updateUserDto.username,
        email: updateUserDto.email,
        status: updateUserDto.status,
        role: updateUserDto.role,
      });
      return  true;
    }
      return false;
  }

  async apiUpdate(id: number, updateUserDto: UpdateUserDto): Promise<UserDto | null> {
    if (await this.userRepository.existById(id)) {
      await this.userRepository.update(id, {
        username: updateUserDto.username,
        email: updateUserDto.email,
        status: updateUserDto.status,
        role: updateUserDto.role,
      });
      const user = await this.userRepository.findOne(id);
      return user ? this.mapToDto(user) : null;
    }
    throw new NotFoundException(`User with ID ${id} not found`);
  }


  async remove(id: number): Promise<boolean> {
    if (await this.userRepository.existById(id)){
      await this.userRepository.remove(id);
      return true;
    }
    return false;
  }
}
