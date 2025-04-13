import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateFirmInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  serviceNames?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  teamMemberNames?: string[];

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  userIds?: number[];

  @Field({ nullable: true })
  @IsOptional()
  contact?: string;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  requestIds?: number[];
}
