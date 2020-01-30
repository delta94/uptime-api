import { Field, ObjectType, InputType } from 'type-graphql';
import { ChecklistGroupItem } from './ChecklistGroupItem';

@ObjectType()
export class ChecklistGroup {
  @Field()
  public description: string;

  @Field(() => [ChecklistGroupItem])
  public items: ChecklistGroupItem[];
}
