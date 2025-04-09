import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateRequestInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  contactInfo: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  serviceRequested: string;
}
