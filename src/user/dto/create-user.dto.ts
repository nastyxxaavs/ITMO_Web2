import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { AuthStatus, Role } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({description: 'User name'})
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({description: 'User email'})
  email: string;

  supertokensId: string;

  @IsEnum(AuthStatus)
  @IsOptional()
  @ApiProperty({description: 'User auth status: AUTHORIZED\n' +
      '  UNAUTHORIZED'})
  status?: AuthStatus;

  @IsEnum(Role)
  @IsOptional()
  @ApiProperty({description: 'User role: CLIENT\n' +
      '  ADMIN\n' +
      '  EMPLOYEE'})
  role?: Role;
}
