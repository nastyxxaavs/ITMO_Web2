import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Redirect,
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

  // @Get('/contacts')
  // @Render('general')
  // async findAll():Promise< { contacts: ContactDto[] } > {
  //   const contacts = await this.contactService.findAll();
  //   if (!contacts || contacts.length === 0) {
  //     throw new NotFoundException(`Contacts are not found`);
  //   }
  //   return { contacts };
  // }
  //
  // @Get(':id')
  // @Render('contact')
  // async findOne(@Param('id') id: number){ //: Promise< { contact: ContactDto }> {
  //   const contact = await this.contactService.findOne(id);
  //   if (!contact) {
  //     throw new NotFoundException(`Contact with ID ${id} not found`);
  //   }
  //   return {
  //     address: contact.address,
  //     phone: contact.phone,
  //     email: contact.email,
  //     mapsLink: contact.mapsLink,
  //     firmName: contact.firmId,
  //   };
  // }
  //
  // @Patch(':id')
  // //@Redirect('/contacts/:id')
  // @Render('contact-edit')
  // @HttpCode(HttpStatus.OK)
  // @HttpCode(HttpStatus.NOT_MODIFIED)
  // async update(@Param('id') id: number, @Body() updateContactDto: UpdateContactDto) {
  //   if( await this.contactService.update(+id, updateContactDto)){
  //     return { statusCode: HttpStatus.OK };
  //   }
  //   return { statusCode: HttpStatus.NOT_MODIFIED };
  // }
  //
  // @Delete(':id')
  // //@Redirect('/contacts')
  // @Render('contacts')
  // @HttpCode(HttpStatus.OK)
  // @HttpCode(HttpStatus.NOT_MODIFIED)
  // async remove(@Param('id') id: number) {
  //   if (await this.contactService.remove(+id)){
  //     const contacts = await this.contactService.findAll();
  //     if (!contacts || contacts.length === 0) {
  //       throw new NotFoundException(`Contacts are not found`);
  //     }
  //     return { contacts,
  //       statusCode: HttpStatus.OK };
  //   }
  //   return { statusCode: HttpStatus.NOT_MODIFIED };
  // }
}
