import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe, NotFoundException, Render, Query, Req,
} from '@nestjs/common';
import { FirmService } from './firm.service';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';

@Controller()
export class FirmController {
  constructor(private readonly firmService: FirmService) {
  }

  @Get('/firm-add')
  @Render('general')
  showFirm(@Req() req) {
    console.log('Incoming request:', req.url);
    const isAuthenticated = req.session.isAuthenticated;
    return {
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      content: "firm-add",
      titleContent: 'Добавить фирму',
      customStyle: '../styles/entity-add.css',
    };
  }

  @Post('/firm-add')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createFirmDto: CreateFirmDto, @Req() req) {
    const isAuthenticated = req.session.isAuthenticated;
    if (!isAuthenticated) {
      return { statusCode: HttpStatus.UNAUTHORIZED, content: 'unauthorized' };
    }
    await this.firmService.create(createFirmDto);
    return {
      statusCode: HttpStatus.CREATED,
      isAuthenticated,
    }
  }


  @Get('/firms')
  @Render('general')
  async findAll(): Promise<{
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
      throw new NotFoundException(`Firms are not found`);
    }
    return {
      firms,
      content: "firms",
      customStyle: '../styles/entities.css'
    };
  }

  @Get('/firms/:id')
  @Render('general')
  async findOne(@Param('id') id: number, @Req() req) {
    console.log('Incoming request:', req.url);
    const isAuthenticated = req.session.isAuthenticated;
    console.log('isAuthenticated:', isAuthenticated);


    const firm = await this.firmService.findOne(id);
    if (!firm) {
      throw new NotFoundException(`Firm with ID ${id} not found`);
    }
    return {
      name: firm.name,
      description: firm.description,
      contact: firm.contactId,
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      titleContent: 'Фирма',
      content: "firm",
      customStyle: '../styles/entity-info.css',
    };
  }

  @Get('/firm-edit/:id')
  @Render('general')
  showContactEdit(@Req() req, @Param('id') id: string) {
    console.log('Incoming request:', req.url);
    const isAuthenticated = req.session.isAuthenticated;
    console.log('isAuthenticated:', isAuthenticated);

    return {
      id,
      isAuthenticated,
      user: isAuthenticated ? 'Anastasia' : null,
      content: "firm-edit",
      titleContent: 'Редактировать фирму',
      customStyle: '../styles/entity-edit.css',
    };
  }

  @Patch('/firm-edit/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() updateFirmDto: UpdateFirmDto) {
    if (await this.firmService.update(+id, updateFirmDto)) {
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }


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


  // @Delete(':id')
  // @Render('firms')
  // //@Redirect('/firms/:id')
  // @HttpCode(HttpStatus.OK)
  // @HttpCode(HttpStatus.NOT_MODIFIED)
  // async remove(@Param('id') id: number) {
  //   if (await this.firmService.remove(+id)){
  //     const firms = await this.firmService.findAll();
  //     if (!firms || firms.length === 0) {
  //       throw new NotFoundException(`Firms are not found`);
  //     }
  //     return { firms,
  //       statusCode: HttpStatus.OK };
  //   }
  //   return { statusCode: HttpStatus.NOT_MODIFIED };
  // }

