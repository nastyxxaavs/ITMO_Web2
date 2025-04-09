import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FirmService } from './firm.service';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { FirmDto } from './dto/firm.dto';


@Resolver(() => FirmDto)
export class FirmResolver {
  constructor(private readonly firmService: FirmService) {}


  @Query(() => [FirmDto], { name: 'getFirms' })
  async getFirms(): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  }[]> {
    return this.firmService.findAll();
  }


  @Query(() => FirmDto, { name: 'getFirm' })
  async getFirm(@Args('id', { type: () => Int }) id: number): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  }> {
    const firm = await this.firmService.findOne(id);
    if (!firm) {
      throw new Error(`Firm with ID ${id} not found`);
    }
    return firm;
  }


  @Mutation(() => FirmDto)
  async createFirm(
    @Args('createFirmInput') createFirmInput: CreateFirmDto,
  ): Promise<FirmDto> {
    return this.firmService.create(createFirmInput);
  }


  @Mutation(() => FirmDto)
  async updateFirm(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateFirmInput') updateFirmInput: UpdateFirmDto,
  ): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  }> {
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
