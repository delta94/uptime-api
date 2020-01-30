import { DateTime } from 'luxon';
import { Field, ObjectType, ID } from 'type-graphql';
import { Role } from '../role/Role';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class RoleAppSettings {
  @Field(() => [Role])
  data: Role[];

  @Field(() => ID, { nullable: true })
  public id?: string;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  updatedOn?: Date;
}
