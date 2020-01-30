import { InputType, Field, ID, Float } from 'type-graphql';
import { EquipmentReferenceInput } from '../equipment/EquipmentReferenceInput';
import { DetailedEquipmentReferenceInput } from '../equipment/DetailedEquipmentReferenceInput';

@InputType()
export class FluidReportInput {
  @Field(() => ID, { nullable: true })
  public id?: string;

  // DEPRECATED - Use detailedEquipment
  @Field(() => EquipmentReferenceInput, { nullable: true })
  public equipment?: EquipmentReferenceInput;

  @Field(() => DetailedEquipmentReferenceInput, { nullable: true })
  public detailedEquipment?: DetailedEquipmentReferenceInput;

  @Field(() => Float)
  public meterValue: number;

  @Field()
  public fluid: string;

  @Field()
  public unitOfMeasure: string;

  @Field(() => Float)
  public amount: number;
}
