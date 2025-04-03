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
  NotFoundException, ValidationPipe, Render, Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/user-add')
  @Render('general')
  showUser(@Req() req) {
    console.log('Incoming request:', req.url);
    const isAuthenticated = req.session.isAuthenticated;
    console.log('isAuthenticated:', isAuthenticated);

    return {
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      content: "user-add",
      titleContent: 'Добавить пользователя',
      customStyle: '../styles/entity-add.css',
    };
  }

  @Post('/user-add')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto, @Req() req) {
    const isAuthenticated = req.session.isAuthenticated;
    if (!isAuthenticated) {
      return { statusCode: HttpStatus.UNAUTHORIZED, content: 'unauthorized' };
    }
    await this.userService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
    isAuthenticated,
    };
  }

  @Get('/users')
  @Render('general')
  async findAll():Promise<{ customStyle: string; users: UserDto[]; content: string }>  {
    const users = await this.userService.findAll();
    if (!users) {
      throw new NotFoundException(`Users are not found`);
    }
    return {users,
      content: "users",
      customStyle: '../styles/entities.css',};
  }

  @Get('/users/:id')
  @Render('general')
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
      content: "user",
      customStyle: '../styles/entity-info.css',
    };
  }

  @Get('/user-edit/:id')
  @Render('general')
  showContactEdit(@Req() req, @Param('id') id: string) {
    console.log('Incoming request:', req.url);
    const isAuthenticated = req.session.isAuthenticated;
    console.log('isAuthenticated:', isAuthenticated);

    return {
      id,
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      content: "user-edit",
      titleContent: 'Редактировать пользователя',
      customStyle: '../styles/entity-edit.css',
    };
  }


  @Patch('/user-edit/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    if( await this.userService.update(+id, updateUserDto)){
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }


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

//   @Delete(':id')
//   //@Redirect('/users')
//   @Render('users')
//   @HttpCode(HttpStatus.OK)
//   @HttpCode(HttpStatus.NOT_MODIFIED)
//   async remove(@Param('id') id: number) {
//     if (await this.userService.remove(+id)){
//       const users = await this.userService.findAll();
//       if (!users || users.length === 0) {}
//       return {
//         users,
//         statusCode: HttpStatus.OK };
//     }
//     return { statusCode: HttpStatus.NOT_MODIFIED };
//   }
}
