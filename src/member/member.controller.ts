import { Controller, Get, Post, Body, Patch, Param, Delete, Redirect } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()

  async create(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.create(createMemberDto);
  }

  @Get()
  async findAll() {
    return this.memberService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.memberService.findOne(+id);
  }

  @Patch(':id')
  @Redirect('/team/:id')
  async update(@Param('id') id: number, @Body() updateMemberDto: UpdateMemberDto) {
    return this.memberService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  @Redirect('/team')
  async remove(@Param('id') id: number) {
    return this.memberService.remove(+id);
  }
}
