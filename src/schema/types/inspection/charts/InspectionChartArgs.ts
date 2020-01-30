import { Field, Int, ArgsType } from 'type-graphql';
@ArgsType()
export class InspectionChartArgs {
  @Field()
  equipmentId: string;
}
