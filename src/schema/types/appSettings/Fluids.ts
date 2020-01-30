import { DateTime } from 'luxon';
import { Field, ObjectType, ID } from 'type-graphql';
import { Fluid } from './Fluid';
import { IsoDateTime } from 'schema/scalars/date';
@ObjectType()
export class Fluids {
  @Field(() => [Fluid])
  public data: Fluid[];

  @Field(() => ID, { nullable: true })
  public id?: string;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  updatedOn?: Date;

  [key: string]: any;
}
