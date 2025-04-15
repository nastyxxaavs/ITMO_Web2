import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get, Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FirmService } from '../firm/firm.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContactDto } from '../contact/dto/contact.dto';
import { NotFoundResponse } from '../common/response';
import { FirmDto } from '../firm/dto/firm.dto';
import { CreateContactDto } from '../contact/dto/create-contact.dto';
import { UpdateContactDto } from '../contact/dto/update-contact.dto';

@ApiTags('user')
@Controller()
export class UserApiController {
  constructor(private readonly userService: UserService, private readonly firmService: FirmService) {}

  @Get('/api/users')
  @ApiResponse({
    status: 200,
    description: 'Users was found.',
    type: [UserDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Users not found',
    type: NotFoundResponse,
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 3,
    @Headers('host') host: string,
  ): Promise<{ total: number; links: string | null; page: number; users: UserDto[] }> {
    const skip = (page - 1) * limit;
    const [users, total] = await this.userService.findAllWithPagination(
      skip,
      limit,
    );

    if (!users) {
      throw new NotFoundException('No users found');
    }

    const totalPages = Math.ceil(total / limit);
    const prevPage = page > 1 ? `${host}/api/users?page=${page - 1}&limit=${limit}` : null;
    const nextPage = page < totalPages ? `${host}/api/users?page=${page + 1}&limit=${limit}` : null;

    const linkHeader: string[] = [];
    if (prevPage) {
      linkHeader.push(`<${prevPage}>; rel="prev"`);
    }
    if (nextPage) {
      linkHeader.push(`<${nextPage}>; rel="next"`);
    }

    return {
      users,
      total,
      page,
      links: linkHeader.length ? linkHeader.join(', ') : null,
    };
  }

  @Get('/api/users/:id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'The user ID' })
  @ApiResponse({
    status: 200,
    description: 'The user was found.',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFoundResponse,
  })
  async findOne(@Param('id') id: number): Promise<UserDto> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }


  @Get('/api/users/:id/firm')
  @ApiOperation({ summary: 'Get a user`s firm by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'The user ID' })
  @ApiResponse({
    status: 200,
    description: 'The firm was found.',
    type: FirmDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Firm not found',
    type: NotFoundResponse,
  })
  async findFirmForUser(@Param('id') id: number): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  }> {
    const user = await this.userService.findOne(id);
    if (! user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const firmId = user.firmName;
    const firm = await this.firmService.findOne(firmId);
    if (!firm) {
      throw new NotFoundException(`No firm associated with user ID ${id}`);
    }
    return firm;
  }

  @Post('/api/user-add')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<UserDto> {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }


  @Patch('/api/user-edit/:id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({ name: 'id', type: Number, description: 'The user ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFoundResponse,
  })
  async update(
    @Param('id') id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const updatedUser = await this.userService.apiUpdate(
      id,
      updateUserDto,
    );
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }


  @Delete('/api/user-delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an existing user' })
  @ApiParam({ name: 'id', type: Number, description: 'The user ID' })
  @ApiResponse({
    status: 204,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFoundResponse,
  })
  async remove(@Param('id') id: number): Promise<void> {
    const removed = await this.userService.remove(id);
    if (!removed) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
