import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { FirmService } from './firm.service';
import { FirmDto } from './dto/firm.dto';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';


@Controller()
export class FirmApiController {
  constructor(private readonly firmService: FirmService) {}

  @Get('/api/firms')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 3,
  ): Promise<{
    total: number;
    firms: {
      contactId: number[] | undefined;
      userIds: number[] | undefined;
      name: string;
      description: string;
      id: number;
      requestIds: number[] | undefined
    }[];
    page: number
  }> {
    const skip = (page - 1) * limit;
    const [firms, total] = await this.firmService.findAllWithPagination(
      skip,
      limit,
    );

    if (!firms) {
      throw new NotFoundException('No firms found');
    }

    return {
      firms,
      total,
      page,
    };
  }

  @Get('/api/firms/:id')
  async findOne(@Param('id') id: number): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  }> {
    const firm = await this.firmService.findOne(id);
    if (!firm) {
      throw new NotFoundException(`Firm with ID ${id} not found`);
    }
    return firm;
  }

  @Post('/api/firm-add')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createFirmDto: CreateFirmDto,
  ): Promise<FirmDto> {
    try {
      return await this.firmService.create(createFirmDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }


  @Patch('/api/firm-edit/:id')
  async update(
    @Param('id') id: number,
    @Body(ValidationPipe) updateFirmDto: UpdateFirmDto,
  ): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  }> {
    const updatedFirm = await this.firmService.apiUpdate(
      id,
      updateFirmDto,
    );
    if (!updatedFirm) {
      throw new NotFoundException(`Firm with ID ${id} not found`);
    }
    return updatedFirm;
  }


  @Delete('/api/contact-delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    const removed = await this.firmService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Firm with ID ${id} not found`);
    }
  }
}
