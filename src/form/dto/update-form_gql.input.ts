import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail } from 'class-validator';

@InputType()
export class UpdateSubmissionInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsEmail()
  email: string;
}
