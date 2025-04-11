import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Contact } from './contact_gql.output';

@ObjectType()
export class PaginatedContacts {
  @Field(() => [Contact])
  contacts: Contact[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field({ nullable: true })
  links?: string;
}
