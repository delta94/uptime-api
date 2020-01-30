import { Field, InputType } from 'type-graphql';

@InputType()
export class SaveChecklistItemNotesInput {
  @Field(() => String!)
  inspectionId: string;

  @Field(() => String!)
  checklistItemId: string;

  @Field(() => String!)
  notes: string;
}
