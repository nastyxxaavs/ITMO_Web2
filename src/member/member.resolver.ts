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
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/entities/user.entity';

@Resolver(() => TeamMember)
export class MemberResolver {
  constructor(
    private readonly memberService: MemberService,
    private readonly firmService: FirmService,
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CLIENT)
  @Query(() => PaginatedMembers, { name: 'getMembers' })
  async getMembers(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 3 }) limit: number,
  ): Promise<[TeamMember[], number]> {
    return this.memberService.findAllWithPagination(page, limit);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CLIENT)
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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CLIENT)
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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => TeamMember)
  async createMember(
    @Args('createMemberInput') createMemberInput: CreateMemberInput,
  ) {
    return this.memberService.create(createMemberInput);
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => TeamMember)
  async assignFirmToMember(
    @Args('memberId', { type: () => Int }) memberId: number,
    @Args('firmName', { type: () => String }) firmName: string,
  ) {
    return this.memberService.assignFirm(memberId, firmName);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => TeamMember)
  async removeFirmFromMember(
    @Args('memberId', { type: () => Int }) memberId: number,
  ) {
    return this.memberService.removeFirm(memberId);
  }
}
