import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Firm } from '../../firm/dto/firm_gql.output';

@ObjectType()
export class Contact {
  @Field(() => Int)
  id: number;

  @Field()
  address: string;

  @Field()
  phone: string;

  @Field()
  email: string;

  @Field()
  mapsLink: string;

  @Field(() => Int, { nullable: true })
  firmId?: number;

  @Field(() => Firm, { nullable: true })
  firm?: Firm;
}
