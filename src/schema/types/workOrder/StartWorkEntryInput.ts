import { Field, ID, InputType, GraphQLISODateTime } from 'type-graphql';
import { WorkOrderStatusEnum } from '../Enums';

@InputType()
export class StartWorkEntryInput {
  @Field(() => ID)
  public readonly id: string;

  @Field(() => WorkOrderStatusEnum)
  public status: WorkOrderStatusEnum;
}
