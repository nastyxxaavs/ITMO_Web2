import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFirmDto {
  @IsString()
  @ApiProperty({description: 'Firm name'})
  name: string;

  @IsString()
  @ApiProperty({description: 'Description'})
  description: string;

  @IsOptional()
  @ApiProperty({description: 'Services provided'})
  serviceNames?: string[];

  @IsOptional()
  @ApiProperty({description: 'Firm members'})
  teamMemberNames?: string[];

  @IsOptional()
  userIds?: number[];

  @IsOptional()
  @ApiProperty({description: 'Firm contact'})
  contact?: string;

  @IsOptional()
  requestIds?: number[];
}
