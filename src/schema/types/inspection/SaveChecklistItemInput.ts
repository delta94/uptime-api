import { Field, InputType } from 'type-graphql';
import { InspectionChecklistItemInput } from './InspectionChecklistItemInput';

@InputType()
export class SaveChecklistItemInput {
  @Field(() => String!)
  inspectionId: string;

  @Field(() => InspectionChecklistItemInput!)
  checklist: InspectionChecklistItemInput;
}
