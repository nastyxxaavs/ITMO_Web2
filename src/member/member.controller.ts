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
  ValidationPipe,
  NotFoundException,
  Render,
  Req,
  UseInterceptors,
  UploadedFile, UseGuards,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { TeamMemberDto } from './dto/member.dto';
import { Position } from './entities/member.entity';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../common/upload.service';
import { AuthGuard } from '@nestjs/passport';
import { PublicAccess } from '../auth/public-access.decorator';

@ApiExcludeController()
@Controller()
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly uploadService: UploadService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/member-add')
  @Render('general')
  showMember(@Req() req) {
   return {
     isAuthenticated: req.session.isAuthenticated,
     user: req.session.user?.username,
      content: 'member-add',
      titleContent: 'Добавить сотрудника',
      customStyle: '../styles/entity-add.css',
    };
  }

  @UseGuards(AuthGuard)
  @Post('/member-add')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('photo'),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body(ValidationPipe) createMemberDto: CreateMemberDto,
    @Req() req,
  ) {
    if (file) {
      try {
        createMemberDto.photoUrl = await this.uploadService.uploadFile(file);
        console.log('File uploaded successfully:', createMemberDto.photoUrl);
      } catch (err) {
        console.error('Error uploading file:', err);
        return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error uploading file' };
      }
    }
    if (!file) {
      console.error('No file uploaded');
      return { statusCode: HttpStatus.BAD_REQUEST, message: 'No file uploaded' };
    }

    await this.memberService.create(createMemberDto);
    return {
      statusCode: HttpStatus.CREATED,
      isAuthenticated: req.session.isAuthenticated,
      user: req.session.user?.username,
    };
  }

  @PublicAccess()
  @Get('/members')
  @Render('general')
  async findAll(): Promise<{
    customStyle: string;
    members: TeamMemberDto[];
    content: string;
    alertMessage?: string;
  }> {
    const members = await this.memberService.findAll();
    if (!members) {
      return {
        members,
        content: 'members',
        customStyle: '../styles/entities.css',
        alertMessage: 'Сотрудники не найдены',
      };
    }
    return {
      members,
      content: 'members',
      customStyle: '../styles/entities.css',
    };
  }


  @PublicAccess()
  @Get('/members/:id')
  @Render('general')
  async findOne(@Param('id') id: number) {
    const member = await this.memberService.findOne(id);
    if (!member) {
      return {
        content: 'member',
        customStyle: '../styles/entity-info.css',
        alertMessage: 'Сотрудник не найден',
      };
    }

    return {
      firstName: member.firstName,
      lastName: member.lastName,
      position: member.position,
      content: 'member',
      customStyle: '../styles/entity-info.css',
    };
  }

  @UseGuards(AuthGuard)
  @Get('/member-edit/:id')
  @Render('general')
  showContactEdit(@Req() req, @Param('id') id: string) {
    return {
      id,
      isAuthenticated: req.session.isAuthenticated,
      user: req.session.user?.username,
      content: 'member-edit',
      titleContent: 'Редактировать сотрудника',
      customStyle: '../styles/entity-edit.css',
    };
  }

  @UseGuards(AuthGuard)
  @Patch('/member-edit/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() updateMemberDto: UpdateMemberDto) {
    const updated = await this.memberService.update(+id, updateMemberDto);
    if (updated) {
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }

  @UseGuards(AuthGuard)
  @Get('/member-delete/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number): Promise<{ success: boolean; message: string }> {
    const isRemoved = await this.memberService.remove(+id);
    if (isRemoved) {
      return {
        success: true,
        message: 'Сотрудник удален успешно',
      };
    } else {
      return {
        success: false,
        message: 'Сотрудник не найден или уже удален',
      };
    }
  }
}
