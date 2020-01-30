import { InputType, Field, ID } from 'type-graphql';
import { RoleTypeEnum, RoleScopeEnum } from '../Enums';
import { PermissionInput } from './PermissionInput';

@InputType()
export class RoleInput {
  
  @Field()
  public name: string;
  
  @Field(() => RoleTypeEnum)
  public type: RoleTypeEnum;
  
  @Field(() => RoleScopeEnum)
  public scope: RoleScopeEnum;
  
  @Field(() => [PermissionInput!])
  public permissions: PermissionInput[];
  
  @Field(() => ID, { nullable: true })
  public readonly id?: string;
}
