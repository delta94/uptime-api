import { ObjectType, Field, Int } from 'type-graphql';
import { Equipment } from './Equipment';
import { DetailedEquipmentReferenceInput } from './DetailedEquipmentReferenceInput';
import { EquipmentReferenceInput } from './EquipmentReferenceInput';
import { IDocumentSession } from 'ravendb';

@ObjectType()
export class DetailedEquipmentReference {
  static async fromEquipmentReferenceInput(session: IDocumentSession, data: EquipmentReferenceInput): Promise<DetailedEquipmentReference> {
    const equipment = await session.load<Equipment>(data.id);
    return new this(equipment.id, equipment.name, equipment.classification, equipment.make, equipment.model, equipment.meterType, equipment.vinOrSerial);
  }

  static fromEquipment(data: Equipment): DetailedEquipmentReference {
    return new this(data.id, data.name, data.classification, data.make, data.model ? data.model : '', data.meterType, data.vinOrSerial);
  }

  static fromDetailedEquipmentReferenceInput(data: DetailedEquipmentReferenceInput): DetailedEquipmentReference {
    return new this(data.id, data.name, data.classification, data.make, data.model ? data.model : '', data.meterType, data.vinOrSerial);
  }

  static fromDetailedEquipmentReferenceInputs(data: DetailedEquipmentReferenceInput[]): DetailedEquipmentReference[] {
    return data.map(e => this.fromDetailedEquipmentReferenceInput(e));
  }

  @Field()
  public id: string;

  @Field()
  public name: string;

  @Field()
  public nickname: string;

  @Field()
  public meterType: string;

  @Field({ defaultValue: '', nullable: true })
  public classification?: string;

  @Field({ defaultValue: '' })
  public make: string;

  @Field({ defaultValue: '' })
  public model: string;

  @Field({ defaultValue: '' })
  public vinOrSerial: string;

  constructor(id: string, name: string, classification: string, make: string, model: string, meterType: string, vinOrSerial: string) {
    this.id = id;
    this.name = name;
    this.classification = classification;
    this.make = make;
    this.model = model;
    this.meterType = meterType;
    this.nickname = name;
    this.vinOrSerial = vinOrSerial;
  }
}
