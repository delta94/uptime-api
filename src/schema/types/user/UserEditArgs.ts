import { Field, ArgsType } from 'type-graphql';
import { User } from './User';
@ArgsType()
export class UserEditArgs {
  
  @Field()
  public id: string;
  
  @Field()
  public user: User;
}
