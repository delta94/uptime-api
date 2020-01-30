import { DateTime } from 'luxon';
import { IDocumentSession } from 'ravendb';
import { ObjectType, Field, ID, Int, Float } from 'type-graphql';
import { EquipmentTypeEnum } from '../Enums';
import { WarrantyInfo } from './WarrantyInfo';
import { UserReference } from '../user/UserReference';
import { InspectionTemplateReference } from '../inspectionTemplate/InspectionTemplateReference';
import { EquipmentInput } from './EquipmentInput';
import { UserReferenceInput } from '../user/UserReferenceInput';
import { WarrantyInfoInput } from './WarrantyInfoInput';
import { InspectionReference } from '../inspection/InspectionReference';
import { ExpectedUsage } from './ExpectedUsage';
import { OfficeLocationReference } from '../officeLocation/OfficeLocationReference';
import { capitalizeEachFirstLetter, capitalize, isEquipmentNameTaken } from '@/helpers/utils';
import { IdNameReference } from '../common/IdNameReference';
import { IdTitleReference } from '../common/IdTitleReference';
import { JobReference } from '../job/JobReference';
import { IsoDateTime } from 'schema/scalars/date';

// $200 --- 0-10 - $25 per person --- $1K
// $200 --- 11-20 - $20 per person --- $5-$10K
// $300 --- 21-50 - $17.5 per person --- $5-$10K
// $500 ---  51-100 - $15 per person --- $15K-$20K
// 101-Custom Pricing - $10-12.50 per person --- $25K
// 5 piece of equipment
// 30 day trial
// no dealers or contact dealer
// no request for service
@ObjectType()
export class Equipment {
  static async fromEquipmentInput(session: IDocumentSession, data: EquipmentInput) {
    let equipment: Equipment;

    const { id, name, nickname, classification, attachment, make, model, ...rest } = data;

    equipment = data.id
      ? await session.load(data.id)
      : new this(
          data.type,
          capitalizeEachFirstLetter(data.nickname),
          capitalizeEachFirstLetter(data.nickname),
          data.vinOrSerial,
          data.year,
          capitalizeEachFirstLetter(data.classification, false),
          capitalizeEachFirstLetter(data.attachment),
          data.inspectionTemplate,
          capitalizeEachFirstLetter(data.make, false),
          capitalizeEachFirstLetter(data.model),
          data.operators,
          data.client,
          data.dateInService,
          data.dateOutOfService,
          data.mechanics,
          data.serviceInterval,
          data.warrantyInfo,
          data.dealers,
          data.initialHours,
          data.expectedUsage,
          data.meterValue
        );

    if (data.id && equipment.name.toString().toLowerCase() !== data.name.toString().toLowerCase()) {
      if (await isEquipmentNameTaken(session, data.name, data.clientId)) {
        throw new Error('Equipment Name already Taken.');
      }
    } else if (!data.id) {
      if (await isEquipmentNameTaken(session, data.name, data.clientId)) {
        throw new Error('Equipment Name already Taken.');
      }
    }

    Object.assign(equipment, {
      ...rest,
      name: capitalizeEachFirstLetter(data.nickname),
      nickname: capitalizeEachFirstLetter(data.nickname),
      classification: capitalizeEachFirstLetter(data.classification, false),
      attachment: capitalizeEachFirstLetter(data.attachment),
      make: capitalizeEachFirstLetter(data.make, false),
      model: capitalizeEachFirstLetter(data.model),
      updatedOn: DateTime.utc().toJSDate(),
    });
    return equipment;
  }

  static async fromAny(data: any) {
    let equipment: Equipment;
    const { id, ...rest } = data;
    equipment = new this(
      data.type,
      capitalizeEachFirstLetter(data.name),
      capitalizeEachFirstLetter(data.nickname),
      data.vinOrSerial,
      data.year,
      capitalizeEachFirstLetter(data.classification, false),
      capitalizeEachFirstLetter(data.attachment),
      data.inspectionTemplate,
      capitalizeEachFirstLetter(data.make, false),
      capitalizeEachFirstLetter(data.model),
      data.operators,
      data.client,
      data.dateInService,
      data.dateOutOfService,
      data.mechanics,
      data.serviceInterval,
      data.warrantyInfo,
      data.dealer,
      data.initialHours,
      data.expectedUsage,
      data.meterValue
    );
    Object.assign(equipment, { ...rest, updatedOn: DateTime.utc().toJSDate() });
    return equipment;
  }

  static fromImport(data: any) {
    let equipment: Equipment;
    equipment = new this(
      data.type,
      capitalizeEachFirstLetter(data.nickname),
      capitalizeEachFirstLetter(data.nickname),
      data.vinOrSerial,
      data.year ? Number(data.year) : null,
      capitalizeEachFirstLetter(data.classification, false),
      null,
      null,
      capitalizeEachFirstLetter(data.make, false),
      capitalizeEachFirstLetter(data.model)
    );

    Object.assign(equipment, { meterType: data.meterType, createdOn: DateTime.utc().toJSDate(), updatedOn: DateTime.utc().toJSDate() });
    return equipment;
  }

  @Field(() => ID)
  public id: string;

  @Field({ nullable: true })
  public administrator?: UserReference;

  @Field(() => InspectionReference, { nullable: true })
  public latestInspection?: InspectionReference;

  @Field(() => [UserReference], { nullable: true })
  public mechanics?: UserReference[];

  @Field({ nullable: true })
  public dateOutOfService?: Date;

  @Field()
  public meterType: string;

  @Field(() => Float, { defaultValue: 0 })
  public meterValue: number;

  @Field(() => EquipmentTypeEnum)
  public type: EquipmentTypeEnum;

  @Field(() => String, { nullable: true })
  public classification: string;

  @Field({ nullable: true })
  public attachment?: string;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  public totalInspections?: number;

  @Field(() => Int, { nullable: true })
  public operatingHours?: number;

  @Field(() => IdTitleReference, { nullable: true })
  public serviceInterval?: IdTitleReference;

  @Field({ nullable: true })
  public warrantyInfo?: WarrantyInfo;

  @Field(() => [IdNameReference], { nullable: true })
  public dealers?: IdNameReference[];

  @Field(() => Float, { nullable: true, defaultValue: 0 })
  public initialHours?: number;

  @Field()
  public name: string;

  @Field()
  public nickname: string;

  // DEPRECATED - Use make
  @Field({ nullable: true, defaultValue: '' })
  public manufacturer?: string;

  @Field({ nullable: true })
  public make?: string;

  @Field({ nullable: true })
  public model?: string;

  @Field({ nullable: true })
  public vinOrSerial?: string;

  @Field(() => Int, { nullable: true })
  public year: number;

  @Field(() => InspectionTemplateReference, { nullable: true })
  public inspectionTemplate?: InspectionTemplateReference;

  @Field(() => [UserReference], { nullable: true, defaultValue: [] })
  public operators?: UserReference[];

  @Field(() => IdNameReference, { nullable: true })
  public client?: IdNameReference;

  @Field(() => IdNameReference, { nullable: true })
  public officeLocation?: IdNameReference;

  @Field(() => JobReference, { nullable: true })
  public job?: JobReference;

  @Field({ nullable: true })
  public dateInService?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  public createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  public updatedOn?: Date;

  @Field({ nullable: true })
  public expectedUsage?: ExpectedUsage;

  constructor(
    type: EquipmentTypeEnum,
    name: string,
    nickname: string,
    vinOrSerial: string,
    year: number,
    classification: string,
    attachment?: string,
    inspectionTemplate?: InspectionTemplateReference,
    make?: string,
    model?: string,
    operators?: UserReference[],
    client?: IdNameReference,
    dateInService?: Date,
    dateOutOfService?: Date,
    mechanics?: UserReferenceInput[],
    serviceInterval?: IdTitleReference,
    warrantyInfo?: WarrantyInfoInput,
    dealers?: IdNameReference[],
    initialHours?: number,
    expectedUsage?: ExpectedUsage,
    meterValue: number = 0
  ) {
    this.type = type;
    this.name = name;
    this.nickname = nickname;
    this.make = make;
    this.model = model;
    this.vinOrSerial = vinOrSerial;
    this.classification = classification;
    this.attachment = attachment;
    this.year = year;
    this.inspectionTemplate = inspectionTemplate;
    this.operators = operators;
    this.client = client;
    this.dateInService = dateInService;
    this.dateOutOfService = dateOutOfService;
    this.mechanics = mechanics;
    this.serviceInterval = serviceInterval;
    this.warrantyInfo = warrantyInfo;
    this.initialHours = initialHours;
    this.expectedUsage = expectedUsage;
    this.meterValue = meterValue;
    this.operators = [];
    this.mechanics = [];
    this.dealers = dealers;
  }
}
