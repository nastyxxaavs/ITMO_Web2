import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Firm } from './firm_gql.output';

@ObjectType()
export class PaginatedFirms {
  @Field(() => [Firm])
  firms: Firm[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field({ nullable: true })
  links?: string;
}
