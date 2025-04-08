import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get, Headers,
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
import { FirmDto } from '../firm/dto/firm.dto';
import { FirmService } from '../firm/firm.service';

@Controller()
export class ContactApiController {
  constructor(private readonly contactService: ContactService, private readonly firmService: FirmService) {}

  @Get('/api/contacts')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 3,
    @Headers('host') host: string,
  ): Promise<{ total: number; links: string | null; page: number; contacts: ContactDto[] }> {
    const skip = (page - 1) * limit;
    const [contacts, total] = await this.contactService.findAllWithPagination(
      skip,
      limit,
    );

    if (!contacts) {
      throw new NotFoundException('No contacts found');
    }

    const totalPages = Math.ceil(total / limit);
    const prevPage = page > 1 ? `${host}/api/contacts?page=${page - 1}&limit=${limit}` : null;
    const nextPage = page < totalPages ? `${host}/api/contacts?page=${page + 1}&limit=${limit}` : null;

    const linkHeader: string[] = [];
    if (prevPage) {
      linkHeader.push(`<${prevPage}>; rel="prev"`);
    }
    if (nextPage) {
      linkHeader.push(`<${nextPage}>; rel="next"`);
    }

    return {
      contacts,
      total,
      page,
      links: linkHeader.length ? linkHeader.join(', ') : null,
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


  @Get('/api/contacts/:id/firm')
  async findFirmForContact(@Param('id') id: number): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  }> {
    const contact = await this.contactService.findOne(id);
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    const firmId = contact.firmId;
    const firm = await this.firmService.findOne(firmId);
    if (!firm) {
      throw new NotFoundException(`No firm associated with contact ID ${id}`);
    }
    return firm;
  }

  @Post('/api/contact-add')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createContactDto: CreateContactDto,
  ): Promise<ContactDto> {
      return await this.contactService.create(createContactDto);
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
