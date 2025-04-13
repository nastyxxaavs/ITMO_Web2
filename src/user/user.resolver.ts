import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { FirmService } from '../firm/firm.service';
import { FirmDto } from '../firm/dto/firm.dto';
import { NotFoundException } from '@nestjs/common';
import { User } from './dto/user_gql.output';
import { PaginatedUsers } from './dto/paginated-user_gql.output';
import { Firm } from '../firm/dto/firm_gql.output';
import { UpdateUserInput } from './dto/update-user_gql.input';
import { CreateUserInput } from './dto/create-user_gql.input';
import { Contact } from '../contact/dto/contact_gql.output';
import { AuthStatus, Role } from './entities/user.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly firmService: FirmService,

  ) {}


  @Query(() => PaginatedUsers, { name: 'getUsers' })
  async getUsers(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 3 }) limit: number,
  ){
    const skip = (page - 1) * limit;
    const [users, total] = await this.userService.findAllWithPagination(skip, limit);

    if (!users || total === 0) {
      throw new NotFoundException('No users found');
    }
    return {
      users: users ?? []
    };
  }


  @Query(() => User, { name: 'getUser' })
  async getUser(@Args('id', { type: () => Int }) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }


  // @Query(() => Firm, { name: 'getUserFirm' })
  // async getUserFirm(@Args('id', { type: () => Int }) id: number){
  //   const user = await this.userService.findOne(id);
  //   if (!user) {
  //     throw new NotFoundException(`User with ID ${id} not found`);
  //   }
  //
  //   const firm = await this.firmService.findOne(user.firmName);
  //   if (!firm) {
  //     throw new NotFoundException(`No firm associated with user ID ${id}`);
  //   }
  //
  //   return firm;
  // }



  @ResolveField(() => Firm, { name: 'firm', nullable: true })
  async getFirm(@Parent() user: User): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  } | null> {
    if (!user.firmName) return null;

    const firm = await this.firmService.findOneByName(user.firmName);
    return firm || null;
  }


  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ) {
    return this.userService.create(createUserInput);
  }


  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
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

  @Mutation(() => User)
  async authorizeUser(@Args('id', { type: () => Int }) id: number){
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.status = AuthStatus.AUTHORIZED;
  }


  @Mutation(() => User)
  async unauthorizeUser(@Args('id', { type: () => Int }) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.status = AuthStatus.UNAUTHORIZED;
  }


  @Mutation(() => User)
  async setUserRole(
    @Args('id', { type: () => Int }) id: number,
    @Args('role', { type: () => Role }) role: Role,
  ) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.role = role;

  }
}
