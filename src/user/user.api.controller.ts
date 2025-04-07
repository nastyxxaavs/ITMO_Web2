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


@Controller()
export class UserApiController {
  constructor(private readonly userService: UserService) {}

  @Get('/api/users')
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
  async findOne(@Param('id') id: number): Promise<UserDto> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Post('/api/user-add')
  @HttpCode(HttpStatus.CREATED)
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
  async update(
    @Param('id') id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const updatedUser = await this.userService.apiUpdate(
      id,
      updateUserDto,
    );
    if (!updatedUser) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return updatedUser;
  }


  @Delete('/api/user-delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    const removed = await this.userService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
  }
}
