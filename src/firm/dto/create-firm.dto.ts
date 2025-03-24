import { IsOptional, IsString } from 'class-validator';

export class CreateFirmDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  serviceNames?: string[];

  @IsOptional()
  teamMemberNames?: string[];

  @IsOptional()
  userIds?: number[];

  @IsOptional()
  contact?: string;

  @IsOptional()
  requestIds?: number[];
}
