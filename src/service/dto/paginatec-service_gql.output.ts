import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Service } from './service_gql.output';

@ObjectType()
export class PaginatedServices {
  @Field(() => [Service])
  services: Service[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field({ nullable: true })
  links?: string;
}
