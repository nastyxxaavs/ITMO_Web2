import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe, NotFoundException, Render, Req, Sse, Res, Delete,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactDto } from './dto/contact.dto';
import { interval, map, mergeWith, Observable } from 'rxjs';

@Controller()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Sse('contact-events')
  sendEvents(@Res() res): Observable<MessageEvent> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    return interval(50000).pipe(
      map(() => ({ data: { type: 'heartbeat' } } as MessageEvent)),
      mergeWith(
        this.contactService.getEventStream().pipe(
          map(data => ({ data } as MessageEvent))
        )
      ))
  }

  @Get('/contact-add')
  @Render('general')
  showContact(@Req() req) {
    console.log('Incoming request:', req.url);
    const isAuthenticated = req.session.isAuthenticated;
    console.log('isAuthenticated:', isAuthenticated);

    return {
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      content: "contact-add",
      titleContent: 'Добавить контакт',
      customStyle: '../styles/entity-add.css',
    };
  }

  @Post('/contact-add')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createContactDto: CreateContactDto, @Req() req) {
    const isAuthenticated = req.session.isAuthenticated;
    if (!isAuthenticated) {
      return { statusCode: HttpStatus.UNAUTHORIZED, content: 'unauthorized' };
    }
    await this.contactService.create(createContactDto);
    this.contactService.notifyContactChange('Contact added'); //SSE
    return {
      statusCode: HttpStatus.CREATED,
    isAuthenticated,
    };
  }

  @Get('/contacts')
  @Render('general')
  async findAll():Promise<{ customStyle: string; contacts: ContactDto[]; content: string }> {
    const contacts = await this.contactService.findAll();
    if (!contacts || contacts.length === 0) {
      throw new NotFoundException(`Contacts are not found`);
    }
    return { contacts,
      content: "contacts",
      customStyle: '../styles/entities.css',};
  }

  @Get('/contacts/:id')
  @Render('general')
  async findOne(@Param('id') id: number, @Req() req) {
    console.log('Incoming request:', req.url);
    const isAuthenticated = req.session.isAuthenticated;
    console.log('isAuthenticated:', isAuthenticated);

    const contact = await this.contactService.findOne(id);
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return {
      address: contact.address,
      phone: contact.phone,
      email: contact.email,
      mapsLink: contact.mapsLink,
      firmName: contact.firmId,
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      content: "contact",
      titleContent: 'Контакт',
      customStyle: '../styles/entity-info.css',
    };
  }


  @Get('/contact-edit/:id')
  @Render('general')
  showContactEdit(@Req() req, @Param('id') id: string) {
    console.log('Incoming request:', req.url);
    const isAuthenticated = req.session.isAuthenticated;
    console.log('isAuthenticated:', isAuthenticated);

    return {
      id,
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      content: "contact-edit",
      titleContent: 'Редактировать контакт',
      customStyle: '../styles/entity-edit.css',
    };
  }

  @Patch('/contact-edit/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() updateContactDto: UpdateContactDto) {
    if( await this.contactService.update(id, updateContactDto)) {
      this.contactService.notifyContactChange('Contact updated'); //SSE
      return {
        statusCode: HttpStatus.OK,
      }
    }
      return {
        statusCode: HttpStatus.NOT_MODIFIED,
      }
    }

  @Get('/contact-delete/:id')
  @Render('general')
  async showDeleteOpportunity(@Req() req, @Param('id') id: string) {
    console.log('Incoming request:', req.url);
    const isAuthenticated = req.session.isAuthenticated;
    console.log('isAuthenticated:', isAuthenticated);

    return {
      id,
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      content: "contact-delete",
      titleContent: 'Удалить контакт',
      customStyle: '../styles/entity-edit.css',};
  }

  @Delete('/contact-delete/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number) {
    if (await this.contactService.remove(id)) {
      this.contactService.notifyContactChange('Contact deleted'); //SSE
      return {
        statusCode: HttpStatus.OK,
      }
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }

    // @Get('/contact-delete/:id')
    // @HttpCode(HttpStatus.OK)
    // async removeViaGet(@Param('id') id: number): Promise<{ success: boolean; message: string }> {
    //   const isRemoved = await this.contactService.remove(+id);
    //   if (isRemoved) {
    //     this.contactService.notifyContactChange('Contact deleted'); //SSE
    //     return {
    //       success: true,
    //       message: 'Contact deleted successfully'
    //     };
    //   } else {
    //     return {
    //       success: false,
    //       message: 'Contact not found or already deleted'
    //     };
    //   }
    // }
}

