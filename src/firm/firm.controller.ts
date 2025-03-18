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
import { FirmService } from './firm.service';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { FirmDto } from './dto/firm.dto';
import { ClientRequestDto } from '../requests/dto/request.dto';

@Controller('firms')
export class FirmController {
  constructor(private readonly firmService: FirmService) {}

  @Post()
  @Redirect('/firms')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(ValidationPipe) createFirmDto: CreateFirmDto) {
    await this.firmService.create(createFirmDto);
    return { statusCode: HttpStatus.CREATED };
  }

  @Get()
  async findAll():Promise<FirmDto[]> {
    const firms = await this.firmService.findAll();
    if (!firms) {
      throw new NotFoundException(`Firms are not found`);
    }
    return firms;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<FirmDto> {
    const firm = await this.firmService.findOne(id);
    if (!firm) {
      throw new NotFoundException(`Firm with ID ${id} not found`);
    }
    return firm;
  }

  @Patch(':id')
  @Redirect('/firms/:id')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_MODIFIED)
  async update(@Param('id') id: number, @Body() updateFirmDto: UpdateFirmDto) {
    if(await this.firmService.update(+id, updateFirmDto)){
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }

  @Delete(':id')
  @Redirect('/firms')
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_MODIFIED)
  async remove(@Param('id') id: number) {
    if (await this.firmService.remove(+id)){
      return { statusCode: HttpStatus.OK };
    }
    return { statusCode: HttpStatus.NOT_MODIFIED };
  }
}
