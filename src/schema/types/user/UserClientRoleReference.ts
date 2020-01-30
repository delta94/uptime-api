import { Field, ObjectType, InputType } from 'type-graphql';
import { UserRoleReference } from '../role/UserRoleReference';

@ObjectType()
export class UserClientRoleReference {
  
  @Field()
  id: string;
  
  @Field()
  name: string;
  
  @Field()
  classification: string;
  
  @Field(() => [UserRoleReference])
  roles: UserRoleReference[];
}
