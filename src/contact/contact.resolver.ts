import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactDto } from './dto/contact.dto';

@Resolver(() => ContactDto)
export class ContactResolver {
  constructor(private readonly contactService: ContactService) {}

  @Query(() => [ContactDto], { name: 'getContacts' })
  async getContacts(): Promise<ContactDto[]> {
    return this.contactService.findAll();
  }


  @Query(() => ContactDto, { name: 'getContact' })
  async getContact(@Args('id', { type: () => Int }) id: number): Promise<ContactDto> {
    const contact = await this.contactService.findOne(id);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  }


  @Mutation(() => ContactDto)
  async createContact(
    @Args('createContactInput') createContactInput: CreateContactDto,
  ): Promise<ContactDto> {
    return this.contactService.create(createContactInput);
  }


  @Mutation(() => ContactDto)
  async updateContact(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateContactInput') updateContactInput: UpdateContactDto,
  ): Promise<ContactDto> {
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
