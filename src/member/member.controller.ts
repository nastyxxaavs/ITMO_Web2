import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Redirect,
  HttpCode,
  HttpStatus,
  ValidationPipe, NotFoundException,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { TeamMemberDto } from './dto/member.dto';

@Controller('membes')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @Redirect('/members')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createMemberDto: CreateMemberDto) {
    await this.memberService.create(createMemberDto);
    return { statusCode: HttpStatus.CREATED };
  }

  @Get()
  async findAll(): Promise<TeamMemberDto[]> {
    const members = await this.memberService.findAll();
    if (!members) {
      throw new NotFoundException(`Members are not found`);
    }
    return members;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<TeamMemberDto> {
    const member = await this.memberService.findOne(id);
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  @Patch(':id')
  @Redirect('/members/:id')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_MODIFIED)
  async update(@Param('id') id: number, @Body() updateMemberDto: UpdateMemberDto) {
    if( await this.memberService.update(+id, updateMemberDto)){
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }

  @Delete(':id')
  @Redirect('/members')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_MODIFIED)
  async remove(@Param('id') id: number) {
  if (await this.memberService.remove(+id)){
    return { statusCode: HttpStatus.OK };
  }
  return { statusCode: HttpStatus.NOT_MODIFIED };
  }
}
