import { DateTime } from 'luxon';
import { Field, ObjectType, ID } from 'type-graphql';
import { RolePermissionsByType } from './RolePermissionsByType';
import { AvailablePermission } from '../role/AvailablePermission';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class RolePermissionsAppSettings {
  @Field(() => [AvailablePermission])
  data: AvailablePermission[];

  @Field(() => ID, { nullable: true })
  public id?: string;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  updatedOn?: Date;
}
