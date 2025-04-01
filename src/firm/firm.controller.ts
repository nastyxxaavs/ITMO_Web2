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
  ValidationPipe, NotFoundException, Render, Query, Req,
} from '@nestjs/common';
import { FirmService } from './firm.service';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { FirmDto } from './dto/firm.dto';

@Controller()
export class FirmController {
  constructor(private readonly firmService: FirmService) {}

  @Get('/firm-add')
  @Render('general')
  showFirm(@Req() req){
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
  async findAll():Promise<{
    customStyle: string;
    firms: {
      contactId: number;
      memberNames: Promise<string[]>;
      userIds: number[];
      name: string;
      description: string;
      id: number;
      requestIds: number[];
      serviceNames: Promise<string[]>
    }[];
    content: string
  }> {
    const firms = await this.firmService.findAll();
    if (!firms || firms.length === 0) {
      throw new NotFoundException(`Firms are not found`);
    }
    return { firms,
      content: "firms",
      customStyle: '../styles/entities.css'};
  }

  // @Get(':id')
  // @Render('firm')
  // //@Redirect('/firms/:id')
  // async findOne(@Param('id') id: number){ //: Promise<{firm: FirmDto}> {
  //   const firm = await this.firmService.findOne(id);
  //   if (!firm) {
  //     throw new NotFoundException(`Firm with ID ${id} not found`);
  //   }
  //   return {
  //     name: firm.name,
  //     description: firm.description,
  //     contact: firm.contactId,
  //   };
  // }
  //
  // @Patch(':id')
  // @Render('firm-edit')
  // //@Redirect('/firms/:id')
  // @HttpCode(HttpStatus.OK)
  // @HttpCode(HttpStatus.NOT_MODIFIED)
  // async update(@Param('id') id: number, @Body() updateFirmDto: UpdateFirmDto) {
  //   if(await this.firmService.update(+id, updateFirmDto)){
  //     return { statusCode: HttpStatus.OK };
  //   }
  //   return { statusCode: HttpStatus.NOT_MODIFIED };
  // }
  //
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
}
