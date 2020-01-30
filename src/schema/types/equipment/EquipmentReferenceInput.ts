import { Field, InputType } from 'type-graphql';

@InputType()
export class EquipmentReferenceInput {
  @Field()
  public id: string;

  @Field()
  public name: string;

  @Field()
  public nickname: string;

  @Field()
  public meterType: string;
}
