import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from '../entities/service.entity';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  firmId?: number;

  @IsOptional()
  requestId?: number;

  @IsOptional()
  teamMemberNames?: string[];

  @IsOptional()
  userIds?: number[];
}
