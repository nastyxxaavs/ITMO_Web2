import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateContactInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  address: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  phone: string;

  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  mapsLink: string;

  @IsOptional()
  @Field({ nullable: true })
  firmName?: string;
}

