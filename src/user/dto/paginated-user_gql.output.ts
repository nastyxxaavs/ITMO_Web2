import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from './user_gql.output';

@ObjectType()
export class PaginatedUsers {
  @Field(() => [User])
  users: User[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field({ nullable: true })
  links?: string;
}
