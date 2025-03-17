import { Controller, Get, Post, Body, Patch, Param, Delete, Redirect } from '@nestjs/common';
import { FirmService } from './firm.service';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';

@Controller('firm')
export class FirmController {
  constructor(private readonly firmService: FirmService) {}

  @Post()
  @Redirect('/firms')
  async create(@Body() createFirmDto: CreateFirmDto) {
    return this.firmService.create(createFirmDto);
  }

  @Get()
  async findAll() {
    return this.firmService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.firmService.findOne(+id);
  }

  @Patch(':id')
  @Redirect('/firms/:id')
  async update(@Param('id') id: number, @Body() updateFirmDto: UpdateFirmDto) {
    return this.firmService.update(+id, updateFirmDto);
  }

  @Delete(':id')
  @Redirect('/firms')
  async remove(@Param('id') id: number) {
    return this.firmService.remove(+id);
  }
}
