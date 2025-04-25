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
  NotFoundException, ValidationPipe, Render, Req, UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PublicAccess } from '../auth/public-access.decorator';

@ApiExcludeController()
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/user-add')
  @Render('general')
  showUser(@Req() req) {
    return {
      isAuthenticated: req.session.isAuthenticated,
      user: req.session.user?.username,
      content: "user-add",
      titleContent: 'Добавить пользователя',
      customStyle: '../styles/entity-add.css',
    };
  }

  @UseGuards(AuthGuard)
  @Post('/user-add')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto, @Req() req) {
    await this.userService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      isAuthenticated: req.session.isAuthenticated,
      user: req.session.user?.username,
    };
  }

  @PublicAccess()
  @Get('/users')
  @Render('general')
  async findAll():Promise<{ customStyle: string; users: UserDto[]; content: string; alertMessage?: string  }>  {
    const users = await this.userService.findAll();
    if (!users) {
      return {
        users,
        content: "users",
        customStyle: '../styles/entities.css',
        alertMessage: "Пользователи не найдены",};
    }
    return {users,
      content: "users",
      customStyle: '../styles/entities.css',};
  }


  @PublicAccess()
  @Get('/users/:id')
  @Render('general')
  async findOne(@Param('id') id: number){ //: Promise<{ user: UserDto}> {
    const user = await this.userService.findOne(id);
    if (!user) {
      return {
        content: "user",
        customStyle: '../styles/entity-info.css',
        alertMessage: "Пользователь не найден",
      };
    }
    return {
      username: user.username,
      email: user.email,
      status: user.status,
      role: user.role,
      content: "user",
      customStyle: '../styles/entity-info.css',
    };
  }

  @UseGuards(AuthGuard)
  @Get('/user-edit/:id')
  @Render('general')
  showContactEdit(@Req() req, @Param('id') id: string) {
    return {
      id,
      isAuthenticated: req.session.isAuthenticated,
      user: req.session.user?.username,
      content: "user-edit",
      titleContent: 'Редактировать пользователя',
      customStyle: '../styles/entity-edit.css',
    };
  }

  @UseGuards(AuthGuard)
  @Patch('/user-edit/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    if( await this.userService.update(+id, updateUserDto)){
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }

  @UseGuards(AuthGuard)
  @Get('/user-delete/:id')
  @HttpCode(HttpStatus.OK)
  async removeViaGet(@Param('id') id: number): Promise<{ success: boolean; message: string }> {
    const isRemoved = await this.userService.remove(+id);
    if (isRemoved) {
      return {
        success: true,
        message: 'Contact deleted successfully'
      };
    } else {
      return {
        success: false,
        message: 'Contact not found or already deleted'
      };
    }
  }
}
