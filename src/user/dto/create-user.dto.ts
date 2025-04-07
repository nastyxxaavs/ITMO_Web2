import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { AuthStatus, Role } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(AuthStatus)
  @IsOptional()
  status?: AuthStatus;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
