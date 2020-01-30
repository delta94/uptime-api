import { Field, ObjectType } from 'type-graphql';
import { AvailablePermission } from '../role/AvailablePermission';
import { RolePermissionsByTypeInput } from './RolePermissionsByTypeInput';

@ObjectType()
export class RolePermissionsByType {
  static fromRolePermissionsByTypeInput(data: RolePermissionsByTypeInput): RolePermissionsByType {
    const corporate = data.corporate.map(input => AvailablePermission.fromAvailablePermissionInput(input));
    const developer = data.developer.map(input => AvailablePermission.fromAvailablePermissionInput(input));
    const client = data.client.map(input => AvailablePermission.fromAvailablePermissionInput(input));
    return new this(corporate, developer, client);
  }

  @Field(() => [AvailablePermission])
  corporate: AvailablePermission[];

  @Field(() => [AvailablePermission])
  developer: AvailablePermission[];

  @Field(() => [AvailablePermission])
  client: AvailablePermission[];

  constructor(corporate: AvailablePermission[], developer: AvailablePermission[], client: AvailablePermission[]) {
    this.corporate = corporate;
    this.developer = developer;
    this.client = client;
  }
}
