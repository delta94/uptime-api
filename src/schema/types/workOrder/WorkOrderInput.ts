import { Field, ID, InputType, Float } from 'type-graphql';
import { WorkOrderStatusEnum } from '../Enums';
import { EquipmentReferenceInput } from '../equipment/EquipmentReferenceInput';
import { UserReferenceInput } from '../user/UserReferenceInput';
import { DetailedEquipmentReferenceInput } from '../equipment/DetailedEquipmentReferenceInput';
import { IdNameReferenceInput } from '../common/IdNameReferenceInput';
import { getNowUtc } from '@/helpers/utils';

@InputType()
export class WorkOrderInput {
  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  // DEPRECATED - Use detailedEquipment
  @Field(() => EquipmentReferenceInput, { nullable: true })
  public equipment?: EquipmentReferenceInput;

  @Field(() => DetailedEquipmentReferenceInput, { nullable: true })
  public detailedEquipment?: DetailedEquipmentReferenceInput;

  // This is only used on front end for the antd values.equipment obj
  @Field({ nullable: true })
  public equipmentId?: string;

  @Field(() => [UserReferenceInput], { nullable: true })
  public assignedTo?: UserReferenceInput[];

  // This is only used on front end for the antd values obj
  @Field(() => [String], { nullable: true })
  public assignedToIds?: string[];

  @Field(() => String, { nullable: true })
  public notes?: string;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  public photos?: string[];

  @Field(() => WorkOrderStatusEnum, { nullable: true, defaultValue: WorkOrderStatusEnum.Open })
  public status?: WorkOrderStatusEnum;

  @Field(() => IdNameReferenceInput, { nullable: true })
  client?: IdNameReferenceInput;

  @Field({ nullable: true })
  clientId?: string;

  @Field(() => Float, { nullable: true, defaultValue: 0 })
  meterValue: number;
}
