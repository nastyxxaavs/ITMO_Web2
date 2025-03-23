import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthStatus, Role, User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/user.dto';

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
      password: createUserDto.password,
      status: createUserDto.status,
      role: createUserDto.role,
      firmId: createUserDto.firmId,
      serviceIds: createUserDto.serviceIds,
      requestIds: createUserDto.requestIds,
    });
  }

  async findAll():Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(this.mapToDto);
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
        password: updateUserDto.password,
        status: updateUserDto.status,
        role: updateUserDto.role,
        firmId: updateUserDto.firmId,
        serviceIds: updateUserDto.serviceIds,
        requestIds: updateUserDto.requestIds,
      });
      return  true;
    }
      return false;
  }

  async remove(id: number): Promise<boolean> {
    if (await this.userRepository.existById(id)){
      await this.userRepository.remove(id);
      return true;
    }
    return false;
  }
}
