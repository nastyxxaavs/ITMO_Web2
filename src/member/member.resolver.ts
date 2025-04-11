import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { TeamMemberDto } from './dto/member.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { FirmService } from '../firm/firm.service';
import { FirmDto } from '../firm/dto/firm.dto';
import { TeamMember } from './dto/member_gql.output';
import { PaginatedMembers } from './dto/paginated-member_gql.output';
import { Firm } from '../firm/dto/firm_gql.output';

@Resolver(() => TeamMember)
export class MemberResolver {
  constructor(
    private readonly memberService: MemberService,
    private readonly firmService: FirmService,
  ) {}


  @Query(() => PaginatedMembers, { name: 'getMembers' })
  async getMembers(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 3 }) limit: number,
  ): Promise<[TeamMember[], number]> {
    return this.memberService.findAllWithPagination(page, limit);
  }


  @Query(() => TeamMember, { name: 'getMember' })
  async getMember(@Args('id', { type: () => Int }) id: number): Promise<TeamMember> {
    const member = await this.memberService.findOne(id);
    if (!member) {
      throw new Error(`Member with ID ${id} not found`);
    }
    return member;
  }


  @Query(() => Firm, { name: 'getMemberFirm' })
  async getMemberFirm(@Args('id', { type: () => Int }) id: number) {
    const member = await this.memberService.findOne(id);
    if (!member) {
      throw new Error(`Member with ID ${id} not found`);
    }

    const firm = await this.firmService.findOneByName(member.firmName);
    if (!firm) {
      throw new Error(`No firm associated with member ID ${id}`);
    }

    return firm;
  }


  @Mutation(() => TeamMember)
  async createMember(
    @Args('createMemberInput') createMemberInput: CreateMemberDto,
  ): Promise<TeamMember> {
    return this.memberService.create(createMemberInput);
  }


  @Mutation(() => TeamMember)
  async updateMember(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateMemberInput') updateMemberInput: UpdateMemberDto,
  ): Promise<TeamMember> {
    const updatedMember = await this.memberService.apiUpdate(id, updateMemberInput);
    if (!updatedMember) {
      throw new Error(`Member with ID ${id} not found`);
    }
    return updatedMember;
  }


  @Mutation(() => Boolean)
  async removeMember(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    const removed = await this.memberService.remove(id);
    if (!removed) {
      throw new Error(`Member with ID ${id} not found`);
    }
    return true;
  }
}
