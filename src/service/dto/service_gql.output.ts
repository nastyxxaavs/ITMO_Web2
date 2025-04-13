import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Category } from '../entities/service.entity';
import { Firm } from '../../firm/dto/firm_gql.output';

@ObjectType()
export class Service {
  @Field(type => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Category)
  category: Category;

  @Field(() => Int)
  price: number;

  @Field(() => Int, { nullable: true })
  firmId?: number;

  @Field(() => Int, { nullable: true })
  requestId?: number;

  @Field(() => [String], { nullable: true })
  teamMemberNames?: string[];

  @Field(() => [Int], { nullable: true })
  userIds?: number[];

  @Field(() => Firm, { nullable: true })
  firm?: Firm;
}
