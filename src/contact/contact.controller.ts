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
  ValidationPipe, NotFoundException,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactDto } from './dto/contact.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @Redirect('/contacts')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createContactDto: CreateContactDto) {
    await this.contactService.create(createContactDto);
    return { statusCode: HttpStatus.CREATED };
  }

  @Get()
  async findAll():Promise<ContactDto[]> {
    const contacts = await this.contactService.findAll();
    if (!contacts) {
      throw new NotFoundException(`Contacts are not found`);
    }
    return contacts;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ContactDto> {
    const contact = await this.contactService.findOne(id);
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  @Patch(':id')
  @Redirect('/contacts/:id')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_MODIFIED)
  async update(@Param('id') id: number, @Body() updateContactDto: UpdateContactDto) {
    if( await this.contactService.update(+id, updateContactDto)){
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }

  @Delete(':id')
  @Redirect('/contacts')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_MODIFIED)
  async remove(@Param('id') id: number) {
    if (await this.contactService.remove(+id)){
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }
}
