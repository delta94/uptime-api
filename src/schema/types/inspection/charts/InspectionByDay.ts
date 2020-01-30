import { ObjectType, Field, Int, Float } from 'type-graphql';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class InspectionByDay {
  @Field()
  public type: string;

  @Field(() => Float)
  public meterValueDaily: number;

  @Field()
  public equipmentId: string;

  @Field()
  public clientId: string;

  @Field(() => IsoDateTime)
  createdOn: Date;

  @Field(() => Int)
  public total: number;
}
