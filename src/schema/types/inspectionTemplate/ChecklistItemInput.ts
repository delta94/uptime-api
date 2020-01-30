import { Field, ObjectType, InputType, ID } from 'type-graphql';
import { ChecklistItemTypeEnum } from '../Enums';
import { ChecklistItemStatusInput } from './ChecklistItemStatusInput';

@InputType()
export class ChecklistItemInput {
  @Field(() => ID, { nullable: true })
  public id: string;

  @Field()
  public title: string;

  @Field(() => ChecklistItemTypeEnum)
  public type: ChecklistItemTypeEnum;

  @Field()
  public consumable: boolean;

  @Field({ nullable: true })
  public consumableFluid?: string;

  @Field()
  public photoRequired: boolean;

  @Field(() => [ChecklistItemStatusInput], { nullable: true })
  public statuses?: ChecklistItemStatusInput[];
}
