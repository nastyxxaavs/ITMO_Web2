import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Contact {
  @Field(type => Int)
  id: number;

  @Field()
  address: string;

  @Field()
  phone: string;

  @Field()
  email: string;

  @Field()
  mapsLink: string;

  @Field(type => Int, { nullable: true })
  firmId?: number;
}
