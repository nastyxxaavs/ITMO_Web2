import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Submission {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;
}
