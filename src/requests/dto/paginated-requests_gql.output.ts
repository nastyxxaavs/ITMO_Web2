import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ClientRequest } from './request_gql.output';

@ObjectType()
export class PaginatedRequests {
  @Field(() => [ClientRequest])
  requests: ClientRequest[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field({ nullable: true })
  links?: string;
}
