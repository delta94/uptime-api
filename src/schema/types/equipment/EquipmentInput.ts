import { Field, InputType, ID, Int, Float } from 'type-graphql';
import { EquipmentTypeEnum } from '../Enums';
import { WarrantyInfoInput } from './WarrantyInfoInput';
import { UserReferenceInput } from '../user/UserReferenceInput';
import { InspectionTemplateReferenceInput } from '../inspectionTemplate/InspectionTemplateReferenceInput';
import { ExpectedUsageInput } from './ExpectedUsageInput';
import { IdTitleReferenceInput } from '../common/IdTitleReferenceInput';
import { IdNameReferenceInput } from '../common/IdNameReferenceInput';
import { JobReferenceInput } from '../job/JobReferenceInput';

@InputType()
export class EquipmentInput {
  @Field(() => ID, { nullable: true })
  readonly id?: string;

  @Field({ nullable: true })
  administrator?: UserReferenceInput;

  @Field(() => [UserReferenceInput], { nullable: true })
  mechanics?: UserReferenceInput[];

  @Field({ nullable: true })
  dateOutOfService?: Date;

  @Field()
  meterType: string;

  @Field(() => Float, { nullable: true, defaultValue: 0 })
  meterValue?: number;

  @Field({ nullable: true })
  warrantyInfo?: WarrantyInfoInput;

  @Field(() => [IdNameReferenceInput], { nullable: true })
  dealers?: IdNameReferenceInput[];

  @Field(() => Float, { nullable: true })
  initialHours?: number;

  @Field(() => EquipmentTypeEnum)
  type: EquipmentTypeEnum;

  @Field({ nullable: true })
  classification?: string;

  @Field({ nullable: true })
  attachment?: string;

  @Field()
  name: string;

  @Field()
  nickname: string;

  // DEPRECATED - Use make
  @Field({ nullable: true, defaultValue: '' })
  public manufacturer?: string;

  @Field({ nullable: true })
  make: string;

  @Field({ nullable: true })
  model?: string;

  @Field({ nullable: true })
  vinOrSerial?: string;

  @Field(() => Int, { nullable: true })
  year?: number;

  @Field(() => InspectionTemplateReferenceInput, { nullable: true })
  inspectionTemplate?: InspectionTemplateReferenceInput;

  @Field({ nullable: true }) // needed for equipment drop down
  inspectionTemplateId?: string;

  @Field(() => [UserReferenceInput], { nullable: true })
  operators?: UserReferenceInput[];

  @Field(() => IdNameReferenceInput, { nullable: true })
  client?: IdNameReferenceInput;

  @Field(() => IdNameReferenceInput, { nullable: true })
  public officeLocation?: IdNameReferenceInput;

  @Field(() => JobReferenceInput, { nullable: true })
  public job?: JobReferenceInput;

  @Field({ nullable: true })
  clientId?: string;

  @Field({ nullable: true })
  serviceIntervalId?: string;

  @Field(() => IdTitleReferenceInput, { nullable: true })
  serviceInterval?: IdTitleReferenceInput;

  @Field({ nullable: true })
  dateInService?: Date;

  @Field()
  expectedUsage: ExpectedUsageInput;
}
