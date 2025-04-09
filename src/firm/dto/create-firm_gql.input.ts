import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateFirmInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field(type => [String], { nullable: true })
  @IsOptional()
  serviceNames?: string[];

  @Field(type => [String], { nullable: true })
  @IsOptional()
  teamMemberNames?: string[];

  @Field(type => [Int], { nullable: true })
  @IsOptional()
  userIds?: number[];

  @Field({ nullable: true })
  @IsOptional()
  contact?: string;

  @Field(type => [Int], { nullable: true })
  @IsOptional()
  requestIds?: number[];
}
