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
import { FirmService } from './firm.service';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { ApiExcludeController } from '@nestjs/swagger';
import { PublicAccess, SuperTokensAuthGuard, VerifySession, Session as STSession } from 'supertokens-nestjs';
import { Request } from 'express';
import Session from 'supertokens-node/recipe/session';


@ApiExcludeController()
@Controller()
export class FirmController {
  constructor(private readonly firmService: FirmService) {}

  @UseGuards(SuperTokensAuthGuard)
  @VerifySession()
  @Get('/firm-add')
  @Render('general')
  async showFirm(@Req() req: Request) {
    const session = await Session.getSession(req, req.res, { sessionRequired: true });
    const payload = session.getAccessTokenPayload();

    return {
      isAuthenticated: payload.isAuthenticated,
      user: payload.username,
      content: 'firm-add',
      titleContent: 'Добавить фирму',
      customStyle: '../styles/entity-add.css',
    };
  }

  @UseGuards(SuperTokensAuthGuard)
  @VerifySession()
  @Post('/firm-add')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createFirmDto: CreateFirmDto, @Req() req: Request) {
    const session = await Session.getSession(req, req.res, { sessionRequired: true });
    const payload = session.getAccessTokenPayload();
    await this.firmService.create(createFirmDto);
    return {
      statusCode: HttpStatus.CREATED,
      isAuthenticated: payload.isAuthenticated,
      user: payload.username,
    };
  }

  @PublicAccess()
  @Get('/firms')
  @Render('general')
  async findAll(): Promise<{
    alertMessage?: string;
    customStyle: string;
    firms: {
      contactId: number[] | undefined;
      userIds: number[] | undefined;
      name: string;
      description: string;
      id: number;
      requestIds: number[] | undefined;
    }[];
    content: string;
  }> {
    const firms = await this.firmService.findAll();
    if (!firms || firms.length === 0) {
      return {
        firms,
        content: 'firms',
        customStyle: '../styles/entities.css',
        alertMessage: 'Фирмы не найдены',
      };
    }
    return {
      firms,
      content: 'firms',
      customStyle: '../styles/entities.css',
    };
  }


  @Get('/firms/:id')
  @VerifySession()
  @Render('general')
  async findOne(@Param('id') id: number, @Req() req: Request) {
    const session = await Session.getSession(req, req.res, { sessionRequired: true });
    const payload = session.getAccessTokenPayload();
    const firm = await this.firmService.findOne(id);
    if (!firm) {
      return {
        isAuthenticated: payload.isAuthenticated,
        user: payload.username,
        titleContent: 'Фирма',
        content: 'firm',
        customStyle: '../styles/entity-info.css',
        alertMessage: 'Фирма не найдена',
      };
    }
    return {
      name: firm.name,
      description: firm.description,
      contact: firm.contactId,
      isAuthenticated: payload.isAuthenticated,
      user: payload.username,
      titleContent: 'Фирма',
      content: 'firm',
      customStyle: '../styles/entity-info.css',
    };
  }

  @UseGuards(SuperTokensAuthGuard)
  @VerifySession()
  @Get('/firm-edit/:id')
  @Render('general')
  async showContactEdit(@Req() req: Request, @Param('id') id: string) {
    const session = await Session.getSession(req, req.res, { sessionRequired: true });
    const payload = session.getAccessTokenPayload();

    return {
      id,
      isAuthenticated: payload.isAuthenticated,
      user: payload.username,
      content: 'firm-edit',
      titleContent: 'Редактировать фирму',
      customStyle: '../styles/entity-edit.css',
    };
  }

  @UseGuards(SuperTokensAuthGuard)
  @Patch('/firm-edit/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() updateFirmDto: UpdateFirmDto) {
    if (await this.firmService.update(+id, updateFirmDto)) {
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }

  @UseGuards(SuperTokensAuthGuard)
  @Get('/firm-delete/:id')
  @HttpCode(HttpStatus.OK)
  async removeViaGet(
    @Param('id') id: number,
  ): Promise<{ success: boolean; message: string }> {
    const isRemoved = await this.firmService.remove(+id);
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
