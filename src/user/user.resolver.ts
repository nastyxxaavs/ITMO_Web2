import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { FirmService } from '../firm/firm.service';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { User } from './dto/user_gql.output';
import { PaginatedUsers } from './dto/paginated-user_gql.output';
import { Firm } from '../firm/dto/firm_gql.output';
import { UpdateUserInput } from './dto/update-user_gql.input';
import { CreateUserInput } from './dto/create-user_gql.input';
import { AuthStatus, Role } from './entities/user.entity';
import { SuperTokensAuthGuard } from 'supertokens-nestjs';


@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly firmService: FirmService,
  ) {}

  @UseGuards(SuperTokensAuthGuard)
  @Query(() => PaginatedUsers, { name: 'getUsers' })
  async getUsers(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 3 }) limit: number,
  ) {
    const skip = (page - 1) * limit;
    const [users, total] = await this.userService.findAllWithPagination(
      skip,
      limit,
    );

    if (!users || total === 0) {
      throw new NotFoundException('No users found');
    }
    return {
      users: users ?? [],
    };
  }

  @UseGuards(SuperTokensAuthGuard)
  @Query(() => User, { name: 'getUser' })
  async getUser(@Args('id', { type: () => Int }) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @UseGuards(SuperTokensAuthGuard)
  @ResolveField(() => Firm, { name: 'firm', nullable: true })
  async getFirm(@Parent() user: User): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined;
  } | null> {
    if (!user.firmName) return null;

    const firm = await this.firmService.findOneByName(user.firmName);
    return firm || null;
  }


  @UseGuards(SuperTokensAuthGuard)
  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }


  @UseGuards(SuperTokensAuthGuard)
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


  @UseGuards(SuperTokensAuthGuard)
  @Mutation(() => Boolean)
  async removeUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    const removed = await this.userService.remove(id);
    if (!removed) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return true;
  }

  @UseGuards(SuperTokensAuthGuard)
  @Mutation(() => User)
  async authorizeUser(@Args('id', { type: () => Int }) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.status = AuthStatus.AUTHORIZED;
  }


  @UseGuards(SuperTokensAuthGuard)
  @Mutation(() => User)
  async unauthorizeUser(@Args('id', { type: () => Int }) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.status = AuthStatus.UNAUTHORIZED;
  }

  @UseGuards(SuperTokensAuthGuard)
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
