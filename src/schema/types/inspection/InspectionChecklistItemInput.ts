import { Field, InputType, ID, Float } from 'type-graphql';
import { ChecklistItemTypeEnum } from '../Enums';

@InputType()
export class InspectionChecklistItemInput {
  @Field(() => ID, { nullable: true })
  public id: string;

  @Field()
  public title: string;

  @Field(() => ChecklistItemTypeEnum)
  public type: ChecklistItemTypeEnum;

  @Field({ defaultValue: false })
  public consumable: boolean;

  @Field({ nullable: true })
  public consumableFluid?: string;

  @Field(() => Float, { nullable: true })
  public consumableAmount?: number; // Is this only data entry front end?

  @Field({ nullable: true })
  public consumableUnitOfMeasure?: string;

  @Field({ nullable: true, defaultValue: '' })
  public notes?: string;

  @Field({ nullable: true })
  public status?: string;

  @Field(() => Float, { nullable: true })
  public numericStatus?: number;

  @Field({ nullable: true })
  public textStatus?: string;

  @Field({ defaultValue: false })
  public completed: boolean;

  @Field({ defaultValue: false })
  public shouldSendAlert: boolean;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  public photos?: string[];
}
