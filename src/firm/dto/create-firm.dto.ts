import { IsOptional, IsString } from 'class-validator';

export class CreateFirmDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  serviceIds?: number[];

  @IsOptional()
  teamMemberIds?: number[];

  @IsOptional()
  userIds?: number[];

  @IsOptional()
  contactId?: number;

  @IsOptional()
  requestIds?: number[];
}
