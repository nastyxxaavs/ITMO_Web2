import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactDto } from './dto/contact.dto';
import { PaginatedContacts } from './dto/paginated-contact_gql.output';
import { Contact } from './dto/contact_gql.output';

@Resolver(() => Contact)
export class ContactResolver {
  constructor(private readonly contactService: ContactService) {}


  @Query(() => Contact, { name: 'getContact' })
  async getContact(@Args('id', { type: () => Int }) id: number): Promise<Contact> {
    const contact = await this.contactService.findOne(id);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  }


  @Query(() => PaginatedContacts, { name: 'getContacts' })
  async getContacts(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 3 }) limit: number,
  ): Promise<{ total: number; links: string | null; page: number; contacts: Contact[] }> {
    const skip = (page - 1) * limit;
    const [contacts, total] = await this.contactService.findAllWithPagination(skip, limit);

    const totalPages = Math.ceil(total / limit);
    const prevPage = page > 1 ? `?page=${page - 1}&limit=${limit}` : null;
    const nextPage = page < totalPages ? `?page=${page + 1}&limit=${limit}` : null;

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


  @Mutation(() => Contact)
  async createContact(
    @Args('createContactInput') createContactInput: CreateContactDto,
  ): Promise<Contact> {
    return this.contactService.create(createContactInput);
  }


  @Mutation(() => Contact)
  async updateContact(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateContactInput') updateContactInput: UpdateContactDto,
  ): Promise<Contact> {
    const updatedContact = await this.contactService.apiUpdate(id, updateContactInput);
    if (!updatedContact) {
      throw new Error('Failed to update contact');
    }
    return updatedContact;
  }


  @Mutation(() => Boolean)
  async removeContact(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    const removed = await this.contactService.remove(id);
    if (!removed) {
      throw new Error(`Contact with ID ${id} not found`);
    }
    return true;
  }
}
