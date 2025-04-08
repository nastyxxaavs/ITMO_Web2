import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @IsString()
  @ApiProperty({description: 'Form name'})
  name: string;

  @IsEmail()
  @ApiProperty({description: 'Email'})
  email: string;
}
