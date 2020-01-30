import { Field, ObjectType, InputType } from 'type-graphql';
import { StandardChecklistGroupItemEnum } from '../Enums';
@ObjectType()
export class ChecklistGroupItem {
  @Field()
  public title: string;

  @Field()
  public status: StandardChecklistGroupItemEnum;

  @Field()
  public note: string;
}
