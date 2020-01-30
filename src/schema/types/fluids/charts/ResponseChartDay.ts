import { ObjectType, Field, Int } from 'type-graphql';
import { FluidReport } from '../FluidReport';
import { DayItem } from './DayItem';
@ObjectType()
export class ResponseChartDay {
  @Field()
  chartByDayDataJSON: string;

  @Field(() => [String!])
  fluidNames: string[];
}
