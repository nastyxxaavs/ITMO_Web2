import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Position } from '../entities/member.entity';

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(Position)
  position: Position;

  @IsOptional()
  firmName?: string;

  @IsOptional()
  serviceNames?: string[];

  @IsOptional()
  requestId?: number;
}
