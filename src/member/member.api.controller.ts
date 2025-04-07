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


@Controller()
export class MemberApiController {
  constructor(private readonly memberService: MemberService) {}

  @Get('/api/members')
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
  async findOne(@Param('id') id: number): Promise<TeamMemberDto> {
    const member = await this.memberService.findOne(id);
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  @Post('/api/member-add')
  @HttpCode(HttpStatus.CREATED)
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
  async remove(@Param('id') id: number): Promise<void> {
    const removed = await this.memberService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
  }
}
