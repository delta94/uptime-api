import { ObjectType, Field, Int } from 'type-graphql';
import { FluidReport } from '../FluidReport';
import { DayItem } from './DayItem';
@ObjectType()
export class ResponseChartTotal {
  @Field(() => [FluidReport])
  chartData: FluidReport[];
}
