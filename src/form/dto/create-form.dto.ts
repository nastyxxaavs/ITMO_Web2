import { IsString, IsEmail } from 'class-validator';

export class CreateSubmissionDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
