import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from '../entities/request.entity';

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @IsString()
  @IsNotEmpty()
  contactInfo: string;

  @IsNotEmpty()
  @IsString()
  serviceRequestedId: number;
}
