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
import { MemberService } from './member.service';
import { TeamMemberDto } from './dto/member.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { FirmService } from '../firm/firm.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FirmDto } from '../firm/dto/firm.dto';
import { NotFoundResponse } from '../response';

@ApiTags('member')
@Controller()
export class MemberApiController {
  constructor(private readonly memberService: MemberService, private readonly firmService: FirmService) {}

  @Get('/api/members')
  @ApiResponse({
    status: 200,
    description: 'Members was found.',
    type: [TeamMemberDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Members not found',
    type: NotFoundResponse,
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 3,
    @Headers('host') host: string,
  ): Promise<{ total: number; members: TeamMemberDto[]; links: string | null; page: number }> {
    const skip = (page - 1) * limit;
    const [members, total] = await this.memberService.findAllWithPagination(
      skip,
      limit,
    );

    if (!members) {
      throw new NotFoundException('No members found');
    }

    const totalPages = Math.ceil(total / limit);
    const prevPage = page > 1 ? `${host}/api/members?page=${page - 1}&limit=${limit}` : null;
    const nextPage = page < totalPages ? `${host}/api/members?page=${page + 1}&limit=${limit}` : null;

    const linkHeader: string[] = [];
    if (prevPage) {
      linkHeader.push(`<${prevPage}>; rel="prev"`);
    }
    if (nextPage) {
      linkHeader.push(`<${nextPage}>; rel="next"`);
    }

    return {
      members,
      total,
      page,
      links: linkHeader.length ? linkHeader.join(', ') : null,
    };
  }

  @Get('/api/members/:id')
  @ApiOperation({ summary: 'Get a member by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'The member ID' })
  @ApiResponse({
    status: 200,
    description: 'The member was found.',
    type: TeamMemberDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Member not found',
    type: NotFoundResponse,
  })
  async findOne(@Param('id') id: number): Promise<TeamMemberDto> {
    const member = await this.memberService.findOne(id);
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }


  @Get('/api/members/:id/firm')
  @ApiOperation({ summary: 'Get a member`s firm by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'The member ID' })
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
  async findFirmForMember(@Param('id') id: number): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  }> {
    const member = await this.memberService.findOne(id);
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    const firmName = member.firmName;
    const firm = await this.firmService.findOneByName(firmName);
    if (!firm) {
      throw new NotFoundException(`No firm associated with member ID ${id}`);
    }
    return firm;
  }


  @Post('/api/member-add')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new member' })
  @ApiBody({ type: CreateMemberDto })
  @ApiResponse({
    status: 201,
    description: 'The member has been successfully created.',
    type: TeamMemberDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async create(
    @Body(ValidationPipe) createMemberDto: CreateMemberDto,
  ): Promise<TeamMemberDto> {
    try {
      return await this.memberService.create(createMemberDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }


  @Patch('/api/member-edit/:id')
  @ApiOperation({ summary: 'Update an existing member' })
  @ApiParam({ name: 'id', type: Number, description: 'The member ID' })
  @ApiBody({ type: UpdateMemberDto })
  @ApiResponse({
    status: 200,
    description: 'The contact has been successfully updated.',
    type: TeamMemberDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Member not found',
    type: NotFoundResponse,
  })
  async update(
    @Param('id') id: number,
    @Body(ValidationPipe) updateMemberDto: UpdateMemberDto,
  ): Promise<TeamMemberDto> {
    const updatedMember = await this.memberService.apiUpdate(
      id,
      updateMemberDto,
    );
    if (!updatedMember) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return updatedMember;
  }


  @Delete('/api/member-delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an existing member' })
  @ApiParam({ name: 'id', type: Number, description: 'The member ID' })
  @ApiResponse({
    status: 204,
    description: 'The member has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Member not found',
    type: NotFoundResponse,
  })
  async remove(@Param('id') id: number): Promise<void> {
    const removed = await this.memberService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
  }
}
