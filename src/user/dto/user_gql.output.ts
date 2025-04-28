import { ObjectType, Field, Int } from '@nestjs/graphql';
import { AuthStatus, Role } from '../entities/user.entity';
import { Firm } from '../../firm/dto/firm_gql.output';
import { Column } from 'typeorm';

@ObjectType()
export class User {
  @Field(type => Int)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field(() => AuthStatus)
  status: AuthStatus;

  @Field(() => Role)
  role: Role;

  @Field({ nullable: true })
  firmName?: string;

  @Column({ name: 'supertokensId', type: 'varchar', nullable: true, unique: true })
  supertokensId: string;

  @Field(() => [Int], { nullable: true })
  serviceNames?: number[];

  @Field(() => [Int], { nullable: true })
  requestIds?: number[];

  @Field(() => Firm, { nullable: true })
  firm?: Firm;
}
