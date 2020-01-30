import { Field, ObjectType } from 'type-graphql';
import { LoggedInUser } from './LoggedInUser';

@ObjectType()
export class LoginResponse {
  
  @Field()
  user: LoggedInUser;
  
  @Field()
  token: string;
}
