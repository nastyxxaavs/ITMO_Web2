import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe, NotFoundException, Render,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { TeamMemberDto } from './dto/member.dto';
import { Position } from './entities/member.entity';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  //@Redirect('/members')
  @Render('member-add')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createMemberDto: CreateMemberDto) {
    await this.memberService.create(createMemberDto);
    return { statusCode: HttpStatus.CREATED };
  }

  @Get()
  @Render('members')
  async findAll(): Promise<{
    members: {
      firstName: string;
      lastName: string;
      requestId: number;
      firmName: string;
      id: number;
      position: Position;
      serviceNames: Promise<string[]>
    }[]
  }> {
    const members = await this.memberService.findAll();
    if (!members) {
      throw new NotFoundException(`Members are not found`);
    }
    return  { members };
  }

  @Get(':id')
  @Render('member')
  async findOne(@Param('id') id: number){ //: Promise< { member: TeamMemberDto }> {
    const member = await this.memberService.findOne(id);
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return {
      firstname: member.firstName,
       lastname: member.lastName,
       position: member.position,
    };
  }

  @Patch(':id')
  //@Redirect('/members/:id')
  @Render('member-edit')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_MODIFIED)
  async update(@Param('id') id: number, @Body() updateMemberDto: UpdateMemberDto) {
    if( await this.memberService.update(+id, updateMemberDto)){
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }

  @Delete(':id')
  //@Redirect('/members')
  @Render('members')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_MODIFIED)
  async remove(@Param('id') id: number) {
  if (await this.memberService.remove(+id)){
    const members = await this.memberService.findAll();
    if (!members || members.length === 0) {
      throw new NotFoundException(`Members are not found`);
    }
    return { members,
      statusCode: HttpStatus.OK };
  }
  return { statusCode: HttpStatus.NOT_MODIFIED };
  }
}
