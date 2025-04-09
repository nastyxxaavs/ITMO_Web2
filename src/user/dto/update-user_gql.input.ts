import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthStatus, Role } from '../entities/user.entity';

@InputType()
export class UpdateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(type => AuthStatus, { nullable: true })
  @IsEnum(AuthStatus)
  @IsOptional()
  status?: AuthStatus;

  @Field(type => Role, { nullable: true })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
