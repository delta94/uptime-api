import { DateTime } from 'luxon';
import { IDocumentSession } from 'ravendb';
import { ObjectType, Field, ID } from 'type-graphql';
import { ManufacturerModel } from './ManufacturerModel';
import { capitalizeEachFirstLetter } from '@/helpers/utils';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class Manufacturer {
  static async fromManufacturer(session: IDocumentSession, data: Manufacturer) {
    let manufacturer: Manufacturer;
    const { id, createdOn, updatedOn, ...rest } = data;
    if (data.id) {
      manufacturer = await session.load(data.id);
    } else {
      manufacturer = new this(capitalizeEachFirstLetter(data.brand), data.models);
      manufacturer.createdOn = DateTime.utc().toJSDate();
    }
    Object.assign(manufacturer, { ...rest, updatedOn: DateTime.utc().toJSDate() });
    return manufacturer;
  }

  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  @Field()
  public brand: string;

  @Field(() => [ManufacturerModel], { nullable: true })
  public models?: ManufacturerModel[];

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  updatedOn?: Date;

  constructor(brand: string, models: ManufacturerModel[]) {
    this.brand = brand;
    this.models = models;
  }
}
