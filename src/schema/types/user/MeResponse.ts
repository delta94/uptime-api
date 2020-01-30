import { Field, ObjectType } from 'type-graphql';
import { LoggedInUser } from './LoggedInUser';
@ObjectType()
export class MeResponse {
  
  @Field()
  user: LoggedInUser;
}
