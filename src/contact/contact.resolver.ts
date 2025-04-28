import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ContactService } from './contact.service';
import { PaginatedContacts } from './dto/paginated-contact_gql.output';
import { Contact } from './dto/contact_gql.output';
import { FirmService } from '../firm/firm.service';
import { Firm } from '../firm/dto/firm_gql.output';
import { CreateContactInput } from './dto/create-contact_gql.input';
import { UpdateContactInput } from './dto/update-contact_gql.input';
import { UseGuards } from '@nestjs/common';
import { SuperTokensAuthGuard } from 'supertokens-nestjs';


@Resolver(() => Contact)
export class ContactResolver {
  constructor(
    private readonly contactService: ContactService,
    private readonly firmService: FirmService,
  ) {}

  @UseGuards(SuperTokensAuthGuard)
  @Query(() => Contact, { name: 'getContact' })
  async getContact(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Contact> {
    const contact = await this.contactService.findOne(id);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  }

  @UseGuards(SuperTokensAuthGuard)
  @ResolveField(() => Firm, { name: 'firm', nullable: true })
  async getFirm(@Parent() contact: Contact): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined;
  } | null> {
    if (!contact.firmId) return null;

    const firm = await this.firmService.findOne(contact.firmId);
    return firm || null;
  }

  @UseGuards(SuperTokensAuthGuard)
  @Query(() => PaginatedContacts, { name: 'getContacts' })
  async getContacts(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 3 }) limit: number,
  ): Promise<{
    total: number;
    links: string | null;
    page: number;
    contacts: Contact[];
  }> {
    const skip = (page - 1) * limit;
    const [contacts, total] = await this.contactService.findAllWithPagination(
      skip,
      limit,
    );

    const totalPages = Math.ceil(total / limit);
    const prevPage = page > 1 ? `?page=${page - 1}&limit=${limit}` : null;
    const nextPage =
      page < totalPages ? `?page=${page + 1}&limit=${limit}` : null;

    const links: string[] = [];
    if (prevPage) links.push(`<${prevPage}>; rel="prev"`);
    if (nextPage) links.push(`<${nextPage}>; rel="next"`);

    return {
      contacts,
      total,
      page,
      links: links.length ? links.join(', ') : null,
    };
  }


  @UseGuards(SuperTokensAuthGuard)
  @Mutation(() => Contact)
  async createContact(
    @Args('createContactInput') createContactInput: CreateContactInput,
  ) {
    return this.contactService.create(createContactInput);
  }


  @UseGuards(SuperTokensAuthGuard)
  @Mutation(() => Contact)
  async updateContact(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateContactInput') updateContactInput: UpdateContactInput,
  ): Promise<Contact> {
    const updatedContact = await this.contactService.apiUpdate(
      id,
      updateContactInput,
    );
    if (!updatedContact) {
      throw new Error('Failed to update contact');
    }
    return updatedContact;
  }


  @UseGuards(SuperTokensAuthGuard)
  @Mutation(() => Boolean)
  async removeContact(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    const removed = await this.contactService.remove(id);
    if (!removed) {
      throw new Error(`Contact with ID ${id} not found`);
    }
    return true;
  }
}
