import { Field, ObjectType, Int } from 'type-graphql';
import { WorkOrder } from './WorkOrder';

@ObjectType()
export class WorkOrderTableList {
  @Field(() => [WorkOrder!])
  workOrders: WorkOrder[];

  @Field(() => Int)
  totalRows: number;
}
