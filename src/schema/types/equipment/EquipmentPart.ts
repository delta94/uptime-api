import { ObjectType, Field, InputType } from 'type-graphql';
import { EquipmentTypeEnum } from '../Enums';
@ObjectType()
export class EquipmentPart {
  @Field()
  public name: string;

  @Field()
  public make: string;

  @Field()
  public model: string;

  @Field()
  public sku: string;
}
