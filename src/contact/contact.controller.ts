import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Render,
  Req,
  Res,
  Sse,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactDto } from './dto/contact.dto';
import { interval, map, mergeWith, Observable } from 'rxjs';
import { ApiExcludeController } from '@nestjs/swagger';
import { PublicAccess, SuperTokensAuthGuard, VerifySession } from 'supertokens-nestjs';
import { Request } from 'express';
import Session from 'supertokens-node/recipe/session';


@ApiExcludeController()
@Controller()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Sse('contact-events')
  sendEvents(@Res() res): Observable<MessageEvent>{

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');


    return interval(50000).pipe(
      map(() => ({ data: { type: 'heartbeat' } }) as MessageEvent),
      mergeWith(
        this.contactService
          .getEventStream()
          .pipe(map((data) => ({ data }) as MessageEvent)),
      ),
    );
  }

  @UseGuards(SuperTokensAuthGuard)
  @VerifySession()
  @Get('/contact-add')
  @Render('general')
  async showContact(@Req() req: Request) {
    const session = await Session.getSession(req, req.res, { sessionRequired: true });
    const payload = session.getAccessTokenPayload();

    return {
      isAuthenticated: payload.isAuthenticated,
      user: payload.username,
      content: 'contact-add',
      titleContent: 'Добавить контакт',
      customStyle: '../styles/entity-add.css',
    };
  }

  @Post('/contact-add')
  @UseGuards(SuperTokensAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @VerifySession()
  async create(
    @Body(ValidationPipe) createContactDto: CreateContactDto,
    @Req() req: Request,
  ) {
    const session = await Session.getSession(req, req.res, { sessionRequired: true });
    const payload = session.getAccessTokenPayload();
    await this.contactService.create(createContactDto);
    this.contactService.notifyContactChange('Contact added'); //SSE
    return {
      statusCode: HttpStatus.CREATED,
      isAuthenticated: payload?.isAuthenticated,
      user: payload?.username,
    };
  }

  @PublicAccess()
  @Get('/contacts')
  @Render('general')
  async findAll(): Promise<{
    customStyle: string;
    contacts: ContactDto[];
    content: string;
    alertMessage?: string;
  }> {
    const contacts = await this.contactService.findAll();

    if (!contacts || contacts.length === 0) {
      return {
        contacts,
        content: 'contacts',
        customStyle: '../styles/entities.css',
        alertMessage: 'Контакты не найдены',
      };
    }
    return {
      contacts,
      content: 'contacts',
      customStyle: '../styles/entities.css',
    };
  }


  @Get('/contacts/:id')
  @VerifySession()
  @Render('general')
  async findOne(@Param('id') id: number, @Req() req: Request) {
    const session = await Session.getSession(req, req.res, { sessionRequired: true });
    const payload = session.getAccessTokenPayload();
    const contact = await this.contactService.findOne(id);
    if (!contact) {
      return {
        isAuthenticated: payload.isAuthenticated,
        user: payload.username,
        content: 'contact',
        titleContent: 'Контакт',
        customStyle: '../styles/entity-info.css',
        alertMessage: 'Контакт не найден',
      };
    }
    return {
      address: contact.address,
      phone: contact.phone,
      email: contact.email,
      mapsLink: contact.mapsLink,
      firmName: contact.firmId,
      isAuthenticated: payload.isAuthenticated,
      user: payload.username,
      content: 'contact',
      titleContent: 'Контакт',
      customStyle: '../styles/entity-info.css',
    };
  }

  @UseGuards(SuperTokensAuthGuard)
  @VerifySession()
  @Get('/contact-edit/:id')
  @Render('general')
  async showContactEdit(@Req() req: Request, @Param('id') id: string) {
    const session = await Session.getSession(req, req.res, { sessionRequired: true });
    const payload = session.getAccessTokenPayload();

    return {
      id,
      isAuthenticated: payload.isAuthenticated,
      user: payload.username,
      content: 'contact-edit',
      titleContent: 'Редактировать контакт',
      customStyle: '../styles/entity-edit.css',
    };
  }

  @UseGuards(SuperTokensAuthGuard)
  @Patch('/contact-edit/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    if (await this.contactService.update(id, updateContactDto)) {
      this.contactService.notifyContactChange('Contact updated'); //SSE
      return {
        statusCode: HttpStatus.OK,
      };
    }
    this.contactService.notifyContactChange('Failed update');
    return {
      statusCode: HttpStatus.NOT_MODIFIED,
    };
  }

  @UseGuards(SuperTokensAuthGuard)
  @VerifySession()
  @Get('/contact-delete/:id')
  @Render('general')
  async showDeleteOpportunity(@Req() req: Request, @Param('id') id: string) {
    const session = await Session.getSession(req, req.res, { sessionRequired: true });
    const payload = session.getAccessTokenPayload();

    return {
      id,
      isAuthenticated: payload.isAuthenticated,
      user: payload.username,
      content: 'contact-delete',
      titleContent: 'Удалить контакт',
      customStyle: '../styles/entity-edit.css',
    };
  }

  @UseGuards(SuperTokensAuthGuard)
  @Delete('/contact-delete/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number) {
    if (await this.contactService.remove(id)) {
      this.contactService.notifyContactChange('Contact deleted'); //SSE
      return {
        statusCode: HttpStatus.OK,
      };
    }
    this.contactService.notifyContactChange('Failed delete');
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }
}
