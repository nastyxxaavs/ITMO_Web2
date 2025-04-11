import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TeamMember } from './member_gql.output';

@ObjectType()
export class PaginatedMembers {
  @Field(() => [TeamMember])
  members: TeamMember[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field({ nullable: true })
  links?: string;
}
