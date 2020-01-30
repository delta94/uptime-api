import { Field, ObjectType, InputType } from 'type-graphql';
import { StandardChecklistGroupItemEnum } from '../Enums';

@InputType()
export class ChecklistGroupItemInput {
  @Field()
  public title: string;

  @Field()
  public status: StandardChecklistGroupItemEnum;

  @Field()
  public note: string;
}
