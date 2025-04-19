import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Position } from '../entities/member.entity';
import { Firm } from '../../firm/dto/firm_gql.output';
import { IsOptional } from 'class-validator';

@ObjectType()
export class TeamMember {
  @Field(() => Int)
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => Position)
  position: Position;

  @Field({ nullable: true })
  firmName?: string;

  @Field({ nullable: true })
  photoUrl?: string;

  @Field(() => [String], { nullable: true })
  serviceNames?: string[];

  @Field(() => Int, { nullable: true })
  requestId?: number;

  @Field(() => Firm, { nullable: true })
  firm?: Firm;
}
