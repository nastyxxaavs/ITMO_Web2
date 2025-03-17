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
  serviceRequestedId: number;

  @IsDate()
  @IsNotEmpty()
  requestDate: Date;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @IsOptional()
  firmId?: number;

  @IsOptional()
  userId?: number;

  @IsOptional()
  teamMemberId?: number;
}
