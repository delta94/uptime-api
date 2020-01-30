import { DateTime } from 'luxon';
import { Field, ObjectType, ID } from 'type-graphql';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class AppSettings {
  public data: any;

  @Field(() => ID, { nullable: true })
  public id?: string;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  updatedOn?: Date;

  constructor(data: any) {
    this.data = data;
  }
}
