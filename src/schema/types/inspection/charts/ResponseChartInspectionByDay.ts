import { ObjectType, Field } from 'type-graphql';
import { InspectionByDay } from './InspectionByDay';
@ObjectType()
export class ResponseChartInspectionByDay {
  @Field(() => [InspectionByDay])
  chartData: InspectionByDay[];
}
