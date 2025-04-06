import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactDto } from './dto/contact.dto';

@Controller()
export class ContactApiController {
  constructor(private readonly contactService: ContactService) {}

  @Get('/api/contacts')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 3,
  ): Promise<{ contacts: ContactDto[]; total: number; page: number }> {
    const skip = (page - 1) * limit;
    const [contacts, total] = await this.contactService.findAllWithPagination(
      skip,
      limit,
    );

    if (!contacts) {
      throw new NotFoundException('No contacts found');
    }

    return {
      contacts,
      total,
      page,
    };
  }

  @Get('/api/contacts/:id')
  async findOne(@Param('id') id: number): Promise<ContactDto> {
    const contact = await this.contactService.findOne(id);
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  @Post('/api/contact-add')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createContactDto: CreateContactDto,
  ): Promise<ContactDto> {
    try {
      return await this.contactService.create(createContactDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }


  @Patch('/api/contact-edit/:id')
  async update(
    @Param('id') id: number,
    @Body(ValidationPipe) updateContactDto: UpdateContactDto,
  ): Promise<ContactDto> {
    const updatedContact = await this.contactService.apiUpdate(
      id,
      updateContactDto,
    );
    if (!updatedContact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return updatedContact;
  }


  @Delete('/api/contact-delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    const removed = await this.contactService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
  }
}
