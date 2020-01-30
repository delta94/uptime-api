import { ObjectType, Field, InputType } from 'type-graphql';
import { EquipmentTypeEnum } from '../Enums';

@InputType()
export class EquipmentPartInput {
  @Field()
  public name: string;

  @Field(() => EquipmentTypeEnum)
  public type: EquipmentTypeEnum;

  @Field()
  public sku: string;
}
