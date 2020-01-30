import { Field, ID, InputType } from 'type-graphql';
import { WorkOrderStatusEnum } from '../Enums';
import { EquipmentReferenceInput } from '../equipment/EquipmentReferenceInput';
import { UserReferenceInput } from '../user/UserReferenceInput';
import { DetailedEquipmentReferenceInput } from '../equipment/DetailedEquipmentReferenceInput';
import { IdNameReferenceInput } from '../common/IdNameReferenceInput';

@InputType()
export class WorkOrderStatusInput {
  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  @Field(() => [UserReferenceInput], { nullable: true })
  public assignedTo?: UserReferenceInput[];

  @Field(() => String, { nullable: true })
  public notes?: string;

  @Field(() => WorkOrderStatusEnum, { nullable: true, defaultValue: WorkOrderStatusEnum.Open })
  public status?: WorkOrderStatusEnum;
}
