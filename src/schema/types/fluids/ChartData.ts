import { ObjectType, Field, Int } from 'type-graphql';
import { FluidReport } from './FluidReport';
@ObjectType()
export class ChartData {
  @Field(() => [FluidReport])
  chartData: FluidReport[];
}
