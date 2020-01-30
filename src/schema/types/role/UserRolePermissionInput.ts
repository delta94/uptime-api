import { v1 } from 'uuid';
import { InputType, Field, ID } from 'type-graphql';
import { RoleTypeEnum } from '../Enums';

@InputType()
export class UserRolePermissionInput {
  @Field()
  public name: string;

  @Field(() => RoleTypeEnum)
  public type: RoleTypeEnum;

  @Field(() => [String])
  public privileges: string[];

  @Field(() => ID, { nullable: true })
  public id: string = v1();
}
