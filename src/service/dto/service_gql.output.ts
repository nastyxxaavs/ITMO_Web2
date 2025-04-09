import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Category } from '../entities/service.entity';

@ObjectType()
export class Service {
  @Field(type => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(type => Category)
  category: Category;

  @Field(type => Int)
  price: number;

  @Field(type => Int, { nullable: true })
  firmId?: number;

  @Field(type => Int, { nullable: true })
  requestId?: number;

  @Field({ nullable: true })
  teamMemberNames?: string[];

  @Field(type => [Int], { nullable: true })
  userIds?: number[];
}
