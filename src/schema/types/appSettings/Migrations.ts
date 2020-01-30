import { DateTime } from 'luxon';
import { Field, ObjectType, ID } from 'type-graphql';
import { Migration } from './Migration';
import { IsoDateTime } from 'schema/scalars/date';
@ObjectType()
export class Migrations {
  @Field(() => [Migration])
  public data: Migration[];

  @Field(() => ID, { nullable: true })
  public id?: string;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  updatedOn?: Date;

  [key: string]: any;
}
