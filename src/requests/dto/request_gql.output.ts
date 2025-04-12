import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Status } from '../entities/request.entity';
import { Firm } from '../../firm/dto/firm_gql.output';

@ObjectType()
export class ClientRequest {
  @Field(type => Int)
  id: number;

  @Field()
  clientName: string;

  @Field()
  contactInfo: string;

  @Field()
  serviceRequested: string;

  @Field()
  requestDate: Date;

  @Field()
  status: Status;

  @Field(type => Int, { nullable: true })
  firmId?: number;

  @Field(type => Int, { nullable: true })
  userId?: number;

  @Field({ nullable: true })
  teamMemberName?: string;


  @Field(() => Firm, { nullable: true })
  firm?: Firm;

}
