import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe, NotFoundException, Render, Query, Req, UseGuards,
} from '@nestjs/common';
import { FirmService } from './firm.service';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PublicAccess } from '../auth/public-access.decorator';

@ApiExcludeController()
@Controller()
export class FirmController {
  constructor(private readonly firmService: FirmService) {
  }

  @UseGuards(AuthGuard)
  @Get('/firm-add')
  @Render('general')
  showFirm(@Req() req) {
    return {
      isAuthenticated: req.session.isAuthenticated,
      user: req.session.user?.username,
      content: "firm-add",
      titleContent: 'Добавить фирму',
      customStyle: '../styles/entity-add.css',
    };
  }

  @UseGuards(AuthGuard)
  @Post('/firm-add')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createFirmDto: CreateFirmDto, @Req() req) {
    await this.firmService.create(createFirmDto);
    return {
      statusCode: HttpStatus.CREATED,
      isAuthenticated: req.session.isAuthenticated,
      user: req.session.user?.username,
    }
  }

  @PublicAccess()
  @Get('/firms')
  @Render('general')
  async findAll(): Promise<{
    alertMessage?: string;
    customStyle: string;
    firms: {
      contactId: number[] | undefined;
      userIds: number[] | undefined;
      name: string;
      description: string;
      id: number;
      requestIds: number[] | undefined
    }[];
    content: string
  }> {
    const firms = await this.firmService.findAll();
    if (!firms || firms.length === 0) {
      return {
        firms,
        content: "firms",
        customStyle: '../styles/entities.css',
        alertMessage: "Фирмы не найдены",
      };
    }
    return {
      firms,
      content: "firms",
      customStyle: '../styles/entities.css'
    };
  }

  @PublicAccess()
  @Get('/firms/:id')
  @Render('general')
  async findOne(@Param('id') id: number, @Req() req) {
    const firm = await this.firmService.findOne(id);
    if (!firm) {
      return{
        isAuthenticated: req.session.isAuthenticated,
        user: req.session.user?.username,
        titleContent: 'Фирма',
        content: "firm",
        customStyle: '../styles/entity-info.css',
        alertMessage: "Фирма не найдена",
      }
    }
    return {
      name: firm.name,
      description: firm.description,
      contact: firm.contactId,
      isAuthenticated: req.session.isAuthenticated,
      user: req.session.user?.username,
      titleContent: 'Фирма',
      content: "firm",
      customStyle: '../styles/entity-info.css',
    };
  }

  @UseGuards(AuthGuard)
  @Get('/firm-edit/:id')
  @Render('general')
  showContactEdit(@Req() req, @Param('id') id: string) {
    return {
      id,
      isAuthenticated: req.session.isAuthenticated,
      user: req.session.user?.username,
      content: "firm-edit",
      titleContent: 'Редактировать фирму',
      customStyle: '../styles/entity-edit.css',
    };
  }

  @UseGuards(AuthGuard)
  @Patch('/firm-edit/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() updateFirmDto: UpdateFirmDto) {
    if (await this.firmService.update(+id, updateFirmDto)) {
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }


  @UseGuards(AuthGuard)
  @Get('/firm-delete/:id')
  @HttpCode(HttpStatus.OK)
  async removeViaGet(@Param('id') id: number): Promise<{ success: boolean; message: string }> {
    const isRemoved = await this.firmService.remove(+id);
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
