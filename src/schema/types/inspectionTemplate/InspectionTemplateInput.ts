import { Field, ID, InputType } from 'type-graphql';
import { EquipmentTypeEnum } from '../Enums';
import { ChecklistItemInput } from './ChecklistItemInput';

@InputType()
export class InspectionTemplateInput {
  @Field()
  public title: string;

  @Field({ nullable: true, defaultValue: 'en' })
  public language?: string;

  @Field(() => EquipmentTypeEnum)
  public equipmentType: EquipmentTypeEnum;

  @Field()
  public classification?: string;

  @Field({ nullable: true })
  public attachment?: string;

  @Field(() => [ChecklistItemInput])
  public checklist: ChecklistItemInput[];

  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  public forOnboarding?: boolean;
}
