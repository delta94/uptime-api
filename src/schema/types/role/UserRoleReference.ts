import { ObjectType, Field } from 'type-graphql';
import { Permission } from './Permission';
import { RoleInput } from './RoleInput';
import { Role } from './Role';
import { UserRolePermission } from './UserRolePermission';
import { RoleTypeEnum, RoleScopeEnum } from '../Enums';
@ObjectType()
export class UserRoleReference {
  static fromRole(data: Role) {
    return new this(data.id, data.name, data.type, data.permissions);
  }
  static fromRoleInput(data: RoleInput) {
    return new this(data.id, data.name, data.type, data.permissions);
  }

  @Field()
  public id: string;

  @Field()
  public name: string;

  @Field()
  public type: RoleTypeEnum;

  @Field(() => RoleScopeEnum)
  public scope?: RoleScopeEnum;

  @Field(() => [UserRolePermission!])
  public permissions: UserRolePermission[];

  constructor(id: string, name: string, type: RoleTypeEnum, permissions: UserRolePermission[]) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.permissions = permissions;
  }
}
