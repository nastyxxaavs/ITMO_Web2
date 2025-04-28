import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MemberService } from './member.service';
import { FirmService } from '../firm/firm.service';
import { TeamMember } from './dto/member_gql.output';
import { PaginatedMembers } from './dto/paginated-member_gql.output';
import { Firm } from '../firm/dto/firm_gql.output';
import { UpdateMemberInput } from './dto/update-member_gql.input';
import { CreateMemberInput } from './dto/create-member_gql.input';
import { UseGuards } from '@nestjs/common';
import { SuperTokensAuthGuard } from 'supertokens-nestjs';

@Resolver(() => TeamMember)
export class MemberResolver {
  constructor(
    private readonly memberService: MemberService,
    private readonly firmService: FirmService,
  ) {}

  @UseGuards(SuperTokensAuthGuard)
  @Query(() => PaginatedMembers, { name: 'getMembers' })
  async getMembers(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 3 }) limit: number,
  ): Promise<[TeamMember[], number]> {
    return this.memberService.findAllWithPagination(page, limit);
  }

  @UseGuards(SuperTokensAuthGuard)
  @Query(() => TeamMember, { name: 'getMember' })
  async getMember(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<TeamMember> {
    const member = await this.memberService.findOne(id);
    if (!member) {
      throw new Error(`Member with ID ${id} not found`);
    }
    return member;
  }

  @UseGuards(SuperTokensAuthGuard)
  @ResolveField(() => Firm, { name: 'firm', nullable: true })
  async getFirm(@Parent() member: TeamMember): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined;
  } | null> {
    if (!member.firmName) return null;

    const firm = await this.firmService.findOneByName(member.firmName);
    return firm || null;
  }

  @UseGuards(SuperTokensAuthGuard)
  @Mutation(() => TeamMember)
  async createMember(
    @Args('createMemberInput') createMemberInput: CreateMemberInput,
  ) {
    return this.memberService.create(createMemberInput);
  }


  @UseGuards(SuperTokensAuthGuard)
  @Mutation(() => TeamMember)
  async updateMember(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateMemberInput') updateMemberInput: UpdateMemberInput,
  ): Promise<TeamMember> {
    const updatedMember = await this.memberService.apiUpdate(
      id,
      updateMemberInput,
    );
    if (!updatedMember) {
      throw new Error(`Member with ID ${id} not found`);
    }
    return updatedMember;
  }

  @UseGuards(SuperTokensAuthGuard)
  @Mutation(() => Boolean)
  async removeMember(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    const removed = await this.memberService.remove(id);
    if (!removed) {
      throw new Error(`Member with ID ${id} not found`);
    }
    return true;
  }


  @UseGuards(SuperTokensAuthGuard)
  @Mutation(() => TeamMember)
  async assignFirmToMember(
    @Args('memberId', { type: () => Int }) memberId: number,
    @Args('firmName', { type: () => String }) firmName: string,
  ) {
    return this.memberService.assignFirm(memberId, firmName);
  }

  @UseGuards(SuperTokensAuthGuard)
  @Mutation(() => TeamMember)
  async removeFirmFromMember(
    @Args('memberId', { type: () => Int }) memberId: number,
  ) {
    return this.memberService.removeFirm(memberId);
  }
}
