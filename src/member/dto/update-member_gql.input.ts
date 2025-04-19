import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Position } from '../entities/member.entity';

@InputType()
export class UpdateMemberInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Field(() => Position)
  @IsEnum(Position)
  position: Position;

  @Field({ nullable: true })
  @IsOptional()
  firmName?: string;

  @Field({ nullable: true })
  @IsOptional()
  photoUrl?: string;
}
