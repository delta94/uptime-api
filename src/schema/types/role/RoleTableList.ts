import { ObjectType, Field, Int } from 'type-graphql';
import { Role } from './Role';
@ObjectType()
export class RoleTableList {
  @Field(() => [Role])
  roles: Role[];

  @Field(() => Int)
  totalRows: number;
}
