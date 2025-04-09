import { ObjectType, Field, Int } from '@nestjs/graphql';
import { AuthStatus, Role } from '../entities/user.entity';

@ObjectType()
export class User {
  @Field(type => Int)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field(type => AuthStatus)
  status: AuthStatus;

  @Field(type => Role)
  role: Role;

  @Field({ nullable: true })
  firmName?: string;

  @Field(type => [Int], { nullable: true })
  serviceNames?: number[];

  @Field(type => [Int], { nullable: true })
  requestIds?: number[];
}
