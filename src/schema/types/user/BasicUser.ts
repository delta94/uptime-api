import { Field, ObjectType } from 'type-graphql';
import { UserClientRoleReference } from './UserClientRoleReference';
import { UserRoleReference } from '../role/UserRoleReference';

@ObjectType()
export class BasicUser {
  @Field()
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  roles: UserRoleReference;

  @Field()
  clients: UserClientRoleReference;
}
