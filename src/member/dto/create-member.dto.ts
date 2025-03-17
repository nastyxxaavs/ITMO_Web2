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
  firmId?: number;

  @IsOptional()
  serviceIds?: number[];

  @IsOptional()
  requestId?: number;
}
