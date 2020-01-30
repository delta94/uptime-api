import { ObjectType, Field, Int } from 'type-graphql';
import { Equipment } from './Equipment';
import { EquipmentInput } from './EquipmentInput';
import { EquipmentReferenceInput } from './EquipmentReferenceInput';

@ObjectType()
export class EquipmentReference {
  static fromEquipment(data: Equipment) {
    return new this(data.id, data.name, data.nickname, data.meterType);
  }

  static fromEquipmentReferenceInput(data: EquipmentReferenceInput): EquipmentReference {
    return new this(data.id, data.name, data.nickname, data.meterType);
  }

  static fromEquipmentReferenceInputs(data: EquipmentReferenceInput[]): EquipmentReference[] {
    return data.map(e => this.fromEquipmentReferenceInput(e));
  }

  @Field()
  public id: string;

  @Field()
  public name: string;

  @Field()
  public nickname: string;

  @Field()
  public meterType: string;

  constructor(id: string, name: string, nickname: string, meterType: string) {
    this.id = id;
    this.name = name;
    this.nickname = nickname;
    this.meterType = meterType;
  }
}
