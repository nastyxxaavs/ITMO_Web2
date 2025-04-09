import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail } from 'class-validator';

@InputType()
export class CreateSubmissionInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsEmail()
  email: string;
}
