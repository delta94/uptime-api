import { UserRoleReference } from './role/UserRoleReference';
import { ObjectType } from 'type-graphql';
import { Field } from 'type-graphql/dist/decorators/Field';
@ObjectType()
export class JwtUser {
  @Field()
  id: string;

  @Field()
  clientId?: string;

  @Field()
  roles: UserRoleReference[];

  @Field()
  timezone: string;
}
