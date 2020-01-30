import { DateTime } from 'luxon';
import { IDocumentSession } from 'ravendb';
import { Field, ID, ObjectType } from 'type-graphql';
import { EquipmentTypeEnum } from '../Enums';
import { ChecklistItem } from './ChecklistItem';
import { InspectionTemplateInput } from './InspectionTemplateInput';
import { capitalizeEachFirstLetter } from '@/helpers/utils';
import { IdNameReference } from '../common/IdNameReference';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class InspectionTemplate {
  static async fromInspectionTemplateInput(session: IDocumentSession, data: InspectionTemplateInput) {
    let inspectionTemplate: InspectionTemplate;
    const { id, ...rest } = data;
    inspectionTemplate = data.id
      ? await session.load<InspectionTemplate>(data.id)
      : new this(capitalizeEachFirstLetter(data.title), data.equipmentType, capitalizeEachFirstLetter(data.classification, false), data.checklist);

    Object.assign(inspectionTemplate, {
      ...rest,
      title: capitalizeEachFirstLetter(data.title),
      classification: capitalizeEachFirstLetter(data.classification, false),
      attachment: capitalizeEachFirstLetter(data.attachment),
      forOnboarding: data.forOnboarding ? data.forOnboarding : false,
      updatedOn: DateTime.utc().toJSDate(),
    });
    return inspectionTemplate;
  }

  @Field()
  public title: string;

  @Field({ nullable: true, defaultValue: 'en' })
  public language?: string;

  @Field(() => IdNameReference, { nullable: true })
  public client?: IdNameReference;

  @Field({ nullable: true })
  public classification?: string;

  @Field({ nullable: true })
  public attachment?: string;

  @Field(() => EquipmentTypeEnum)
  public equipmentType: EquipmentTypeEnum;

  @Field(() => [ChecklistItem])
  public checklist: ChecklistItem[];

  @Field(() => ID, { nullable: true })
  public id?: string;

  @Field(() => Boolean, { defaultValue: false })
  public forOnboarding: boolean;

  @Field(() => IsoDateTime, { nullable: true, defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { nullable: true, defaultValue: DateTime.utc().toJSDate() })
  updatedOn?: Date;

  constructor(title: string, equipmentType: EquipmentTypeEnum, classification: string, checklist: ChecklistItem[]) {
    this.title = title;
    this.equipmentType = equipmentType;
    this.checklist = checklist;
    this.classification = classification;
  }
}
