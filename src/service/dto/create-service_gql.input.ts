import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from '../entities/service.entity';

@InputType()
export class CreateServiceInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(type => Category)
  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;

  @Field(type => Int)
  @IsNotEmpty()
  price: number;
}
