import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Firm {
  @Field(type => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(type => [String], { nullable: true })
  serviceNames?: string[];

  @Field(type => [String], { nullable: true })
  memberNames?: string[];

  @Field(type => [Int], { nullable: true })
  userIds?: number[];

  @Field(type => Int, { nullable: true })
  contactId?: number;

  @Field(type => [Int], { nullable: true })
  requestIds?: number[];
}
