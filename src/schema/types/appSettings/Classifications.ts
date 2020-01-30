import { DateTime } from 'luxon';
import { Field, ObjectType, ID } from 'type-graphql';
import { Fluid } from './Fluid';
import { Classification } from './Classification';
import { IsoDateTime } from 'schema/scalars/date';
@ObjectType()
export class Classifications {
  @Field(() => [Classification], { defaultValue: [] })
  public data: Classification[];

  @Field(() => ID, { nullable: true })
  public id?: string;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  updatedOn?: Date;

  [key: string]: any;
}
