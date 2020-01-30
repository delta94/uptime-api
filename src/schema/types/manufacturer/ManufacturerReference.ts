import { DateTime } from 'luxon';
import { IDocumentSession } from 'ravendb';
import { ObjectType, Field, ID } from 'type-graphql';
import { Manufacturer } from './Manufacturer';

@ObjectType()
export class ManufacturerReference {
  static fromManufacturer(session: IDocumentSession, data: Manufacturer) {
    return new this(data.id, data.brand);
  }

  @Field({ nullable: true })
  public id?: string;

  @Field()
  public brand: string;

  constructor(id: string, brand: string) {
    this.id = id;
    this.brand = brand;
  }
}
