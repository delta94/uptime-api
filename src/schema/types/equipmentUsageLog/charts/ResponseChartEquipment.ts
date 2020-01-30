import { ObjectType, Field, Int } from 'type-graphql';
import { EquipmentUsageDay } from './EquipmentUsageDay';
@ObjectType()
export class ResponseChartEquipment {
  @Field(() => [EquipmentUsageDay])
  chartData: EquipmentUsageDay[];
}
