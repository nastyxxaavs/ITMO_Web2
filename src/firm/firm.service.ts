import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFirmDto } from './dto/create-firm.dto';
import { UpdateFirmDto } from './dto/update-firm.dto';
import { Firm } from './entities/firm.entity';
import { FirmRepository } from './firm.repository';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class FirmService {
  constructor(
    private readonly firmRepository: FirmRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private mapToDto(firm: Firm): {
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  } {

    return {
      id: firm.id,
      name: firm.name,
      description: firm.description,
      contactId: firm.contacts?.map((contact) => contact.id),
      requestIds: firm.requests?.map((clientRequest) => clientRequest.id),
      userIds: firm.requests?.map((user) => user.id),
    };
  }



  async create(createFirmDto: CreateFirmDto): Promise<Firm> {

    return this.firmRepository.create({
      name: createFirmDto.name,
      description: createFirmDto.description,
      userIds: createFirmDto.userIds,
      requestIds: createFirmDto.requestIds,
    });
  }

  async findAll(): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  }[]> {
    const firms = await this.firmRepository.findAll();
    if (!firms || firms.length === 0) {
      throw new NotFoundException('No firms found');
    }
    return firms.map(this.mapToDto);
  }
  async findAllWithPagination(skip: number, take: number): Promise<[{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined;
  }[], number]> {
    const cacheKey = `firms-page-${skip}-${take}`;

    const cached = await this.cacheManager.get<[ReturnType<typeof this.mapToDto>[], number]>(cacheKey);
    if (cached) {
      console.log('✅ From cache:', cacheKey);
      return cached;
    }

    const [firms, total] = await this.firmRepository.findAllWithPagination(skip, take);
    const mapped = firms.map(this.mapToDto);


    await this.cacheManager.set(cacheKey, [mapped, total], 60);

    console.log('📦 Not from cache (fetched from DB):', cacheKey);

    return [mapped, total];
  }

  async findOne(id: number | undefined): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  } | null> {
    const firm = await this.firmRepository.findOne(id);
    if (!firm) {
      throw new NotFoundException(`Firm with ID ${id} not found`);
    }
    return firm ? this.mapToDto(firm) : null;
  }


  async findOneByName(name: string | undefined): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  } | null> {
    const firm = await this.firmRepository.findOneByName(name);
    if (!firm) {
      throw new NotFoundException(`Firm with name ${name} not found`);
    }
    return firm ? this.mapToDto(firm) : null;
  }

  async update(id: number, updateFirmDto: UpdateFirmDto): Promise<boolean> {
    if (await this.firmRepository.existById(id)) {

      await this.firmRepository.update(id, {
        name: updateFirmDto.name,
        description: updateFirmDto.description,
        userIds: updateFirmDto.userIds,
        requestIds: updateFirmDto.requestIds,
      });
      return true;
    }
    throw new NotFoundException(`Firm with ID ${id} not found`);
  }

  async apiUpdate(id: number, updateFirmDto: UpdateFirmDto): Promise<{
    contactId: number[] | undefined;
    userIds: number[] | undefined;
    name: string;
    description: string;
    id: number;
    requestIds: number[] | undefined
  } | null> {
    if (await this.firmRepository.existById(id)) {
      await this.firmRepository.update(id, {
        name: updateFirmDto.name,
        description: updateFirmDto.description,
        userIds: updateFirmDto.userIds,
        requestIds: updateFirmDto.requestIds,
      });
      const firm = await this.firmRepository.findOne(id);
      return firm ? this.mapToDto(firm) : null;
    }
    throw new NotFoundException(`Firm with ID ${id} not found`);
  }


  async remove(id: number): Promise<boolean> {
    if (await this.firmRepository.existById(id)) {
      await this.firmRepository.remove(id);
      await this.cacheManager.clear();
      return true;
    }
    throw new NotFoundException(`Firm with ID ${id} not found`);
  }
}
