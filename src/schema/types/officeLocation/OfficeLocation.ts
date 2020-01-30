import { DateTime } from 'luxon';
import { ObjectType, Field, ID } from 'type-graphql';
import { IDocumentSession } from 'ravendb';
import { OfficeLocationInput } from './OfficeLocationInput';
import { Address } from '../client/Address';
import { Phone } from '../client/Phone';
import { UserReference } from '../user/UserReference';
import { capitalizeEachFirstLetter } from '@/helpers/utils';
import { IdNameReference } from '../common/IdNameReference';
import { DetailedEquipmentReference } from '../equipment/DetailedEquipmentReference';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class OfficeLocation {
  static async fromOfficeLocationInput(session: IDocumentSession, data: OfficeLocationInput) {
    let loc: OfficeLocation;
    const { id, ...rest } = data;

    if (data.id) {
      loc = await session.load(data.id);
    } else {
      loc = new this(capitalizeEachFirstLetter(data.name), data.addresses, data.phones, data.operators, data.mechanics, data.notificationUsers);
      loc.createdOn = DateTime.utc().toJSDate();
    }
    Object.assign(loc, { ...rest, updatedOn: DateTime.utc().toJSDate() });
    return loc;
  }

  static async fromOfficeLocationInputs(session: IDocumentSession, data: OfficeLocationInput[]): Promise<OfficeLocation[]> {
    const locations: OfficeLocation[] = [];
    for (const loc of data) {
      locations.push(await this.fromOfficeLocationInput(session, loc));
    }
    return locations;
  }

  @Field()
  public name: string;

  @Field(() => UserReference, { nullable: true })
  public administrator?: UserReference;

  @Field(() => IdNameReference)
  public client: IdNameReference;

  @Field(() => [DetailedEquipmentReference!], { nullable: true, defaultValue: [] })
  public equipment?: DetailedEquipmentReference[];

  @Field(() => [Address], { nullable: true, defaultValue: [] })
  public addresses?: Address[];

  @Field(() => [Phone], { nullable: true, defaultValue: [] })
  public phones?: Phone[];

  @Field(() => [UserReference!], { nullable: true, defaultValue: [] })
  public operators?: UserReference[];

  @Field(() => [UserReference!], { nullable: true, defaultValue: [] })
  public mechanics?: UserReference[];

  @Field(() => [UserReference!], { nullable: true, defaultValue: [] })
  public notificationUsers?: UserReference[];

  @Field(() => ID)
  public readonly id: string;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  updatedOn?: Date;

  constructor(
    name: string,
    addresses?: Address[],
    phones?: Phone[],
    operators?: UserReference[],
    mechanics?: UserReference[],
    notificationUsers?: UserReference[]
  ) {
    this.name = name;
    this.addresses = addresses;
    this.phones = phones;
    this.operators = operators;
    this.mechanics = mechanics;
    this.notificationUsers = notificationUsers;
  }
}
