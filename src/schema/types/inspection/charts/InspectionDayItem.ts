import { ObjectType, Field, Float } from 'type-graphql';
import { DateTime } from 'luxon';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class InspectionDayItem {
  @Field()
  name: string;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  date: Date;

  @Field(() => Float)
  value: number;
}
