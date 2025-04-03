import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe, NotFoundException, Render, Req,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactDto } from './dto/contact.dto';

@Controller()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

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
      return {
        statusCode: HttpStatus.OK,
      }
    }
      return {
        statusCode: HttpStatus.NOT_MODIFIED,
      }
    }

  @Get('/contact-delete/:id')
  @HttpCode(HttpStatus.OK)
  async removeViaGet(@Param('id') id: number): Promise<{ success: boolean; message: string }> {
    const isRemoved = await this.contactService.remove(+id);
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


//   @Get('/contact-delete/:id')
//   @Render('general')
//   async showDeleteOpportunity():Promise<{ customStyle: string; contacts: ContactDto[]; content: string }> {
//     const contacts = await this.contactService.findAll();
//     if (!contacts || contacts.length === 0) {
//       throw new NotFoundException(`Contacts are not found`);
//     }
//     return { contacts,
//       content: "contacts",
//       customStyle: '../styles/entities.css',};
//   }
//
//   @Delete('/contact-delete/:id')
//   @HttpCode(HttpStatus.OK)
//   async remove(@Param('id') id: number) {
//     if (await this.contactService.remove(+id)){
//       const contacts = await this.contactService.findAll();
//       if (!contacts || contacts.length === 0) {
//         throw new NotFoundException(`Contacts are not found`);
//       }
//       return { contacts,
//         statusCode: HttpStatus.OK ,
//     }
//   }
//     return { statusCode: HttpStatus.NOT_MODIFIED };
// }
}

