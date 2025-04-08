import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Client name'})
  clientName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Client contact'})
  contactInfo: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({description: 'Requested service'})
  serviceRequested: string;
}
