import { Field, InputType } from 'type-graphql';
import { AvailablePermissionInput } from '../role/AvailablePermissionInput';

@InputType()
export class RolePermissionsByTypeInput {
  @Field(() => [AvailablePermissionInput])
  corporate: AvailablePermissionInput[];

  @Field(() => [AvailablePermissionInput])
  developer: AvailablePermissionInput[];

  @Field(() => [AvailablePermissionInput])
  client: AvailablePermissionInput[];
}
