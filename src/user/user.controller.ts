import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Redirect,
  HttpStatus,
  HttpCode,
  NotFoundException, ValidationPipe, Render,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  //@Redirect('/users')
  @Render('user-add')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto);
    return { statusCode: HttpStatus.CREATED };
  }

  @Get()
  @Render('users')
  async findAll():Promise< { users: UserDto[]}>  {
    const users = await this.userService.findAll();
    if (!users) {
      throw new NotFoundException(`Users are not found`);
    }
    return {users};
  }

  @Get(':id')
  @Render('user')
  async findOne(@Param('id') id: number){ //: Promise<{ user: UserDto}> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      username: user.username,
      email: user.email,
      status: user.status,
      role: user.role,
    };
  }

  @Patch(':id')
  //@Redirect('/users/:id')
  @Render('user-edit')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_MODIFIED)
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    if( await this.userService.update(+id, updateUserDto)){
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }

  @Delete(':id')
  //@Redirect('/users')
  @Render('users')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_MODIFIED)
  async remove(@Param('id') id: number) {
    if (await this.userService.remove(+id)){
      const users = await this.userService.findAll();
      if (!users || users.length === 0) {}
      return {
        users,
        statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }
}
