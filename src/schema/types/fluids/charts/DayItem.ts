import { ObjectType, Field } from 'type-graphql';
import { DateTime } from 'luxon';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class DayItem {
  @Field()
  name: string;

  @Field()
  unitOfMeasure: string;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  date: Date;

  [key: string]: any;
}
