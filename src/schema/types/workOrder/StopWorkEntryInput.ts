import { Field, ID, InputType, GraphQLISODateTime } from 'type-graphql';
import { WorkOrderStatusEnum } from '../Enums';

@InputType()
export class StopWorkEntryInput {
  @Field(() => ID)
  public readonly id: string;

  @Field(() => ID, { nullable: true })
  public readonly workEntryId?: string;

  @Field(() => WorkOrderStatusEnum)
  public status: WorkOrderStatusEnum;

  @Field({ nullable: true, defaultValue: '' })
  public partName?: string;

  @Field({ nullable: true, defaultValue: '' })
  public partNumber?: string;
}
