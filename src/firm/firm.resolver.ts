import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FirmService } from './firm.service';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { FirmDto } from './dto/firm.dto';
import { PaginatedContacts } from '../contact/dto/paginated-contact_gql.output';
import { Contact } from '../contact/dto/contact_gql.output';
import { PaginatedFirms } from './dto/paginated-firm_gql.output';
import { Firm } from './dto/firm_gql.output';


@Resolver(() => Firm)
export class FirmResolver {
  constructor(private readonly firmService: FirmService) {}



  @Query(() => PaginatedFirms, { name: 'getFirms' })
  async getFirms(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 3 }) limit: number,
  ): Promise<{
    total: number;
    links: string | null;
    firms: {
      contactId: number[] | undefined;
      userIds: number[] | undefined;
      name: string;
      description: string;
      id: number;
      requestIds: number[] | undefined
    }[];
    page: number
  }> {
    const skip = (page - 1) * limit;
    const [firms, total] = await this.firmService.findAllWithPagination(skip, limit);

    const totalPages = Math.ceil(total / limit);
    const prevPage = page > 1 ? `?page=${page - 1}&limit=${limit}` : null;
    const nextPage = page < totalPages ? `?page=${page + 1}&limit=${limit}` : null;

    const links: string[] = [];
    if (prevPage) links.push(`<${prevPage}>; rel="prev"`);
    if (nextPage) links.push(`<${nextPage}>; rel="next"`);

    return {
      firms,
      total,
      page,
      links: links.length ? links.join(', ') : null,
    };
  }


  @Query(() => Firm, { name: 'getFirm' })
  async getFirm(@Args('id', { type: () => Int }) id: number) {
    const firm = await this.firmService.findOne(id);
    if (!firm) {
      throw new Error(`Firm with ID ${id} not found`);
    }
    return firm;
  }


  @Mutation(() => Firm)
  async createFirm(
    @Args('createFirmInput') createFirmInput: CreateFirmDto,
  ): Promise<Firm> {
    return this.firmService.create(createFirmInput);
  }


  @Mutation(() => Firm)
  async updateFirm(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateFirmInput') updateFirmInput: UpdateFirmDto,
  ) {
    const updatedFirm = await this.firmService.apiUpdate(id, updateFirmInput);
    if (!updatedFirm) {
      throw new Error(`Firm with ID ${id} not found`);
    }
    return updatedFirm;
  }


  @Mutation(() => Boolean)
  async removeFirm(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    const removed = await this.firmService.remove(id);
    if (!removed) {
      throw new Error(`Firm with ID ${id} not found`);
    }
    return true;
  }
}
