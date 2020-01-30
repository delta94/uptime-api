import { ObjectType, Field, Int, InputType } from 'type-graphql';
import { Equipment } from './Equipment';

@InputType()
export class DetailedEquipmentReferenceInput {
  @Field()
  public id: string;

  @Field()
  public name: string;

  @Field()
  public nickname: string;

  @Field()
  public meterType: string;

  @Field({ nullable: true }) // so it would work with old equipment entries
  public classification?: string;

  @Field({ nullable: true }) // so it would work with old equipment entries
  public make?: string;

  @Field({ nullable: true }) // so it would work with old equipment entries
  public model?: string;

  @Field()
  public vinOrSerial: string;

  constructor(id: string, name: string, classification: string, make: string, model: string, meterType: string) {
    this.id = id;
    this.name = name;
    this.classification = classification;
    this.make = make;
    this.model = model;
    this.meterType = meterType;
  }
}
