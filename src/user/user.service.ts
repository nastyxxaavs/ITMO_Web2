import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthStatus, Role, User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/user.dto';
import { ContactDto } from '../contact/dto/contact.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository,
              @Inject(CACHE_MANAGER) private cacheManager: Cache,) {}

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
    if (!users){
      throw new NotFoundException(`Users are not found`);
    }
    return users.map(this.mapToDto);
  }

  async findAllWithPagination(
    skip: number,
    take: number,
  ): Promise<[UserDto[], number]> {
    const cacheKey = `users-page-${skip}-${take}`;


    const cached = await this.cacheManager.get<[UserDto[], number]>(cacheKey);
    if (cached) {
      console.log('✅ From cache:', cacheKey);
      return cached;
    }

    const [users, total] = await this.userRepository.findAllWithPagination(skip, take);
    const mappedUsers = users.map(this.mapToDto);


    await this.cacheManager.set(cacheKey, [mappedUsers, total], 60);
    console.log('📦 Not from cache (fetched from DB):', cacheKey);

    return [mappedUsers, total];
  }


  async findOne(id: number): Promise<UserDto | null> {
    const user = await this.userRepository.findOne(id);
    if (!user){
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user ? this.mapToDto(user) : null;
  }

  async findByName(username: string): Promise<User | null> {
    const user = await this.userRepository.findOneByName(username);
    if (!user){
      throw new NotFoundException(`User with name ${username} not found`);
    }
    return user;
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
      await this.cacheManager.clear();
      return true;
    }
    throw new NotFoundException(`User with ID ${id} not found`);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findByName(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }
}
