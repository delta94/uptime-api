import { Field, ObjectType, Int } from 'type-graphql';
import { Inspection } from './Inspection';

@ObjectType()
export class InspectionEquipmentTableList {
  @Field(() => [Inspection])
  public inspectionsForEquipment: Inspection[];

  @Field(() => Int)
  public totalRows: number;
}
