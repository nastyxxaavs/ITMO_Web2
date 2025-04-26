import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactDto } from './dto/contact.dto';
import { FirmDto } from '../firm/dto/firm.dto';
import { FirmService } from '../firm/firm.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NotFoundResponse } from '../common/response';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/entities/user.entity';

@ApiTags('contact')
@Controller()
export class ContactApiController {
  constructor(
    private readonly contactService: ContactService,
    private readonly firmService: FirmService,
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CLIENT)
  @Get('/api/contacts')
  @ApiResponse({
    status: 200,
    description: 'Contacts was found.',
    type: [ContactDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Contacts not found',
    type: NotFoundResponse,
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 3,
    @Headers('host') host: string,
  ): Promise<{
    total: number;
    links: string | null;
    page: number;
    contacts: ContactDto[];
  }> {
    const skip = (page - 1) * limit;
    const [contacts, total] = await this.contactService.findAllWithPagination(
      skip,
      limit,
    );

    if (!contacts) {
      throw new NotFoundException('No contacts found');
    }

    const totalPages = Math.ceil(total / limit);
    const prevPage =
      page > 1 ? `${host}/api/contacts?page=${page - 1}&limit=${limit}` : null;
    const nextPage =
      page < totalPages
        ? `${host}/api/contacts?page=${page + 1}&limit=${limit}`
        : null;

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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CLIENT)
  @Get('/api/contacts/:id')
  @ApiOperation({ summary: 'Get a contact by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'The contact ID' })
  @ApiResponse({
    status: 200,
    description: 'The contact was found.',
    type: ContactDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Contact not found',
    type: NotFoundResponse,
  })
  async findOne(@Param('id') id: number): Promise<ContactDto> {
    const contact = await this.contactService.findOne(id);
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CLIENT)
  @Get('/api/contacts/:id/firm')
  @ApiOperation({ summary: 'Get a contact`s firm by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'The contact ID' })
  @ApiResponse({
    status: 200,
    description: 'The firm was found.',
    type: FirmDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Firm not found',
    type: NotFoundResponse,
  })
  async findFirmForContact(@Param('id') id: number): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined;
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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/api/contact-add')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiBody({ type: CreateContactDto })
  @ApiResponse({
    status: 201,
    description: 'The contact has been successfully created.',
    type: ContactDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async create(
    @Body(ValidationPipe) createContactDto: CreateContactDto,
  ): Promise<ContactDto> {
    return await this.contactService.create(createContactDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('/api/contact-edit/:id')
  @ApiOperation({ summary: 'Update an existing contact' })
  @ApiParam({ name: 'id', type: Number, description: 'The contact ID' })
  @ApiBody({ type: UpdateContactDto })
  @ApiResponse({
    status: 200,
    description: 'The contact has been successfully updated.',
    type: ContactDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Contact not found',
    type: NotFoundResponse,
  })
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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/api/contact-delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an existing contact' })
  @ApiParam({ name: 'id', type: Number, description: 'The contact ID' })
  @ApiResponse({
    status: 204,
    description: 'The contact has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Contact not found',
    type: NotFoundResponse,
  })
  async remove(@Param('id') id: number): Promise<void> {
    const removed = await this.contactService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
  }
}
