import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Firm {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String], { nullable: true })
  serviceNames?: string[];

  @Field(() => [String], { nullable: true })
  memberNames?: string[];

  @Field(() => [Int], { nullable: true })
  userIds?: number[];

  @Field(() => Int, { nullable: true })
  contactId?: number;

  @Field(() => [Int], { nullable: true })
  requestIds?: number[];
}
