import { Field, InputType } from 'type-graphql';

@InputType()
export class SaveWorkItemNotesInput {
  @Field(() => String!)
  workOrderId: string;

  @Field(() => String!)
  workItemId: string;

  @Field(() => String!)
  notes: string;
}
