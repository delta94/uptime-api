import { Field, Int, ArgsType } from 'type-graphql';
@ArgsType()
export class EquipmentChartArgs {
  @Field()
  public equipmentId: string;
}
