import { Field, ID, InputType, Float } from 'type-graphql';
import { EquipmentReferenceInput } from '../equipment/EquipmentReferenceInput';
import { DetailedEquipmentReferenceInput } from '../equipment/DetailedEquipmentReferenceInput';

@InputType()
export class ProblemReportInput {
  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  @Field(() => EquipmentReferenceInput, { nullable: true })
  public equipment?: EquipmentReferenceInput;

  @Field(() => DetailedEquipmentReferenceInput, { nullable: true })
  public detailedEquipment?: DetailedEquipmentReferenceInput;

  @Field(() => String!)
  public notes: string;

  @Field(() => Float, { nullable: true, defaultValue: 0 })
  public meterValue: number;
}
