import { Field, ID, InputType, Float } from 'type-graphql';
import { EquipmentReferenceInput } from '../equipment/EquipmentReferenceInput';
import { InspectionChecklistItemInput } from './InspectionChecklistItemInput';
import { DetailedEquipmentReferenceInput } from '../equipment/DetailedEquipmentReferenceInput';
import { IdNameReferenceInput } from '../common/IdNameReferenceInput';

@InputType()
export class InspectionInput {
  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  // DEPRECATED - Use detailedEquipment
  @Field(() => EquipmentReferenceInput, { nullable: true })
  public equipment?: EquipmentReferenceInput;

  @Field(() => DetailedEquipmentReferenceInput, { nullable: true })
  public detailedEquipment?: DetailedEquipmentReferenceInput;

  @Field(() => Float, { nullable: true })
  public meterValue: number;

  @Field(() => String)
  public meterImage: string;

  @Field({ nullable: true })
  public equipmentId?: string;

  @Field(() => String)
  public type: 'Pre-Shift' | 'Post-Shift';

  @Field(() => IdNameReferenceInput, { nullable: true })
  public client?: IdNameReferenceInput;

  @Field({ nullable: true })
  public clientId?: string; // for corporate user to add client

  @Field(() => [InspectionChecklistItemInput])
  public checklist: InspectionChecklistItemInput[];
}
