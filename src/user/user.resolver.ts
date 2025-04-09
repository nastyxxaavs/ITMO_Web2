import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FirmService } from '../firm/firm.service';
import { FirmDto } from '../firm/dto/firm.dto';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => UserDto)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly firmService: FirmService,
  ) {}


  @Query(() => [UserDto], { name: 'getUsers' })
  async getUsers(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 3 }) limit: number,
  ): Promise<UserDto[]> {
    const skip = (page - 1) * limit;
    const [users, total] = await this.userService.findAllWithPagination(skip, limit);

    if (!users || total === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }


  @Query(() => UserDto, { name: 'getUser' })
  async getUser(@Args('id', { type: () => Int }) id: number): Promise<UserDto> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }


  @Query(() => FirmDto, { name: 'getUserFirm' })
  async getUserFirm(@Args('id', { type: () => Int }) id: number): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  }> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const firm = await this.firmService.findOne(user.firmName);
    if (!firm) {
      throw new NotFoundException(`No firm associated with user ID ${id}`);
    }

    return firm;
  }


  @Mutation(() => UserDto)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserDto,
  ): Promise<UserDto> {
    return this.userService.create(createUserInput);
  }


  @Mutation(() => UserDto)
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateUserInput') updateUserInput: UpdateUserDto,
  ): Promise<UserDto> {
    const updatedUser = await this.userService.apiUpdate(id, updateUserInput);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }


  @Mutation(() => Boolean)
  async removeUser(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    const removed = await this.userService.remove(id);
    if (!removed) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return true;
  }
}
