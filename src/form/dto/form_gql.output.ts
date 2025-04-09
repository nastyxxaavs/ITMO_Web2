import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Submission {
  @Field(type => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;
}
