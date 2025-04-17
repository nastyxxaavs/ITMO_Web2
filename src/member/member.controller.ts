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
  ValidationPipe, NotFoundException, Render, Req, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { TeamMemberDto } from './dto/member.dto';
import { Position } from './entities/member.entity';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../common/upload.service';

@ApiExcludeController()
@Controller()
export class MemberController {
  constructor(private readonly memberService: MemberService, private readonly uploadService: UploadService,) {}

  @Get('/member-add')
  @Render('general')
  showMember(@Req() req) {
    console.log('Incoming request:', req.url);
    const isAuthenticated = req.session.isAuthenticated;
    console.log('isAuthenticated:', isAuthenticated);

    return {
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      content: "member-add",
      titleContent: 'Добавить сотрудника',
      customStyle: '../styles/entity-add.css',
    };
  }

  @Post('/member-add')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('photo'))
  async create(@UploadedFile() file: Express.Multer.File,@Body(ValidationPipe) createMemberDto: CreateMemberDto, @Req() req) {
    const isAuthenticated = req.session.isAuthenticated;
    if (!isAuthenticated) {
      return { statusCode: HttpStatus.UNAUTHORIZED, content: 'unauthorized' };
    }

    if (file) {
      createMemberDto.photoUrl = await this.uploadService.uploadFile(file);
    }


    await this.memberService.create(createMemberDto);
    return {
      statusCode: HttpStatus.CREATED,
       isAuthenticated,
    };
  }

  @Get('/members')
  @Render('general')
  async findAll(): Promise<{ customStyle: string; members: TeamMemberDto[]; content: string; alertMessage?: string }> {
    const members = await this.memberService.findAll();
    if (!members) {
      return  {
        members,
        content: "members",
        customStyle: '../styles/entities.css',
        alertMessage: "Сотрудники не найдены",
      };
    }
    return  {
      members,
      content: "members",
      customStyle: '../styles/entities.css',};
  }

  @Get('/members/:id')
  @Render('general')
  async findOne(@Param('id') id: number){
    const member = await this.memberService.findOne(id);
    if (!member) {
      return {
        content: "member",
        customStyle: '../styles/entity-info.css',
        alertMessage: "Сотрудник не найден",
      };
    }

    return {
      firstName: member.firstName,
      lastName: member.lastName,
      position: member.position,
      content: "member",
      customStyle: '../styles/entity-info.css',
    };
  }

  @Get('/member-edit/:id')
  @Render('general')
  showContactEdit(@Req() req, @Param('id') id: string) {
    console.log('Incoming request:', req.url);
    const isAuthenticated = req.session.isAuthenticated;
    console.log('isAuthenticated:', isAuthenticated);

    return {
      id,
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      content: "member-edit",
      titleContent: 'Редактировать сотрудника',
      customStyle: '../styles/entity-edit.css',
    };
  }

  @Patch('/member-edit/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() updateMemberDto: UpdateMemberDto) {
    if( await this.memberService.update(+id, updateMemberDto)){
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }

  @Get('/member-delete/:id')
  @HttpCode(HttpStatus.OK)
  async removeViaGet(@Param('id') id: number): Promise<{ success: boolean; message: string }> {
    const isRemoved = await this.memberService.remove(+id);
    if (isRemoved) {
      return {
        success: true,
        message: 'Contact deleted successfully'
      };
    } else {
      return {
        success: false,
        message: 'Contact not found or already deleted'
      };
    }
  }
}
