import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Submission } from './form_gql.output';

@ObjectType()
export class PaginatedForms {
  @Field(() => [Submission])
  forms: Submission[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field({ nullable: true })
  links?: string;
}
