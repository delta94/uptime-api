import { InputType, Field } from 'type-graphql';
import { PermissionInput } from './PermissionInput';
import { UserRolePermissionInput } from './UserRolePermissionInput';
import { RoleTypeEnum, RoleScopeEnum } from '../Enums';

@InputType()
export class UserRoleReferenceInput {
  @Field()
  public id: string;

  @Field()
  public name: string;

  @Field()
  public type: RoleTypeEnum;

  @Field(() => RoleScopeEnum)
  public scope?: RoleScopeEnum;

  @Field(() => [UserRolePermissionInput!])
  public permissions: UserRolePermissionInput[];
}
