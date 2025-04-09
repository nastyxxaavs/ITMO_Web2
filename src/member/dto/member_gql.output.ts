import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Position } from '../entities/member.entity';

@ObjectType()
export class TeamMember {
  @Field(type => Int)
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(type => Position)
  position: Position;

  @Field({ nullable: true })
  firmName?: string;

  @Field(type => [String], { nullable: true })
  serviceNames?: string[];

  @Field(type => Int, { nullable: true })
  requestId?: number;
}
