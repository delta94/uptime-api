import { Field, ObjectType, InputType } from 'type-graphql';
import { ChecklistItemTypeEnum } from '../Enums';
import { ChecklistItemStatus } from './ChecklistItemStatus';
@ObjectType()
export class ChecklistItem {
  @Field({ nullable: true })
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

  @Field(() => [ChecklistItemStatus], { nullable: true })
  public statuses?: ChecklistItemStatus[];
}
