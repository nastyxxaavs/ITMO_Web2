import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Address of the contact'})
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Phone number'})
  phone: string;

  @IsEmail()
  @ApiProperty({description: 'Email address'})
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'Maps link'})
  mapsLink: string;

  @ApiProperty({description: 'Name of the firm'})
  @IsOptional()
  firmName?: string;
}
