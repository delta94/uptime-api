import { Field, ObjectType, Int } from 'type-graphql';
import { Inspection } from './Inspection';

@ObjectType()
export class InspectionTableList {
  @Field(() => [Inspection])
  public inspections: Inspection[];

  @Field(() => Int)
  public totalRows: number;
}
