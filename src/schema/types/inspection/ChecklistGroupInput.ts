import { Field, ObjectType, InputType } from 'type-graphql';
import { ChecklistGroupItem } from './ChecklistGroupItem';

@InputType()
export class ChecklistGroupInput {
  @Field()
  public description: string;

  @Field(() => [ChecklistGroupItem])
  public items: ChecklistGroupItem[];
}
