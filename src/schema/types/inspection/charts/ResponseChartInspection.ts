import { ObjectType, Field } from 'type-graphql';
import { InspectionChart } from './InspectionChart';
@ObjectType()
export class ResponseChartInspection {
  @Field(() => [InspectionChart])
  chartData: InspectionChart[];
}
