import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Render,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { ApiExcludeController } from '@nestjs/swagger';
import { PublicAccess, SuperTokensAuthGuard, VerifySession, Session as STSession } from 'supertokens-nestjs';
import { Request } from 'express';
import Session from 'supertokens-node/recipe/session';



@ApiExcludeController()
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(SuperTokensAuthGuard)
  @VerifySession()
  @Get('/user-add')
  @Render('general')
  async showUser(@Req() req: Request) {
    const session = await Session.getSession(req, req.res, { sessionRequired: true });
    const payload = session.getAccessTokenPayload();
    return {
      isAuthenticated: payload.isAuthenticated,
      user: payload.username,
      content: 'user-add',
      titleContent: 'Добавить пользователя',
      customStyle: '../styles/entity-add.css',
    };
  }

  @UseGuards(SuperTokensAuthGuard)
  @VerifySession()
  @Post('/user-add')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto, @STSession() session: any) {
    const payload = session.getAccessTokenPayload();
    await this.userService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      isAuthenticated: payload.isAuthenticated,
      user: payload.username,
    };
  }

  @PublicAccess()
  @Get('/users')
  @Render('general')
  async findAll(): Promise<{
    customStyle: string;
    users: UserDto[];
    content: string;
    alertMessage?: string;
  }> {
    const users = await this.userService.findAll();
    if (!users) {
      return {
        users,
        content: 'users',
        customStyle: '../styles/entities.css',
        alertMessage: 'Пользователи не найдены',
      };
    }
    return { users, content: 'users', customStyle: '../styles/entities.css' };
  }

  @PublicAccess()
  @Get('/users/:id')
  @Render('general')
  async findOne(@Param('id') id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      return {
        content: 'user',
        customStyle: '../styles/entity-info.css',
        alertMessage: 'Пользователь не найден',
      };
    }
    return {
      username: user.username,
      email: user.email,
      status: user.status,
      role: user.role,
      content: 'user',
      customStyle: '../styles/entity-info.css',
    };
  }

  @UseGuards(SuperTokensAuthGuard)
  @VerifySession()
  @Get('/user-edit/:id')
  @Render('general')
  async showContactEdit(@Req() req: Request, @Param('id') id: string) {
    const session = await Session.getSession(req, req.res, { sessionRequired: true });
    const payload = session.getAccessTokenPayload();
    return {
      id,
      isAuthenticated: payload.isAuthenticated,
      user: payload.username,
      content: 'user-edit',
      titleContent: 'Редактировать пользователя',
      customStyle: '../styles/entity-edit.css',
    };
  }

  @UseGuards(SuperTokensAuthGuard)
  @Patch('/user-edit/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    if (await this.userService.update(+id, updateUserDto)) {
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }

  @UseGuards(SuperTokensAuthGuard)
  @Get('/user-delete/:id')
  @HttpCode(HttpStatus.OK)
  async removeViaGet(
    @Param('id') id: number,
  ): Promise<{ success: boolean; message: string }> {
    const isRemoved = await this.userService.remove(+id);
    if (isRemoved) {
      return {
        success: true,
        message: 'Contact deleted successfully',
      };
    } else {
      return {
        success: false,
        message: 'Contact not found or already deleted',
      };
    }
  }
}
