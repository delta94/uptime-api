import { ObjectType, Field, Int } from 'type-graphql';
import { RolePermission } from './RolePermission';

@ObjectType()
export class RolePermissionTableList {
  @Field(() => [RolePermission])
  rolePermissions: RolePermission[];

  @Field(() => Int)
  totalRows: number;
}
