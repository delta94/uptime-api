import { ObjectType, InputType, Field } from 'type-graphql';
import { EquipmentTypeEnum } from '../Enums';

@InputType()
export class ManufacturerModelInput {
  @Field({ nullable: true })
  public name?: string;

  @Field(() => EquipmentTypeEnum, { nullable: true })
  public equipmentType?: EquipmentTypeEnum;

  constructor(name: string, equipmentType: EquipmentTypeEnum) {
    this.name = name;
    this.equipmentType = equipmentType;
  }
}
