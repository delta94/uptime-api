import { DateTime } from 'luxon';
import { IDocumentSession } from 'ravendb';
import { ObjectType, Field, ID } from 'type-graphql';
import { DealerPhone } from './DealerPhone';
import { DealerInput } from './DealerInput';
import { DealerAddress } from './DealerAddress';
import shortid = require('shortid');
import { JwtUser } from '../JwtUser';
import { DealerContact } from '../dealerContact/DealerContact';
import { IdNameReference } from '../common/IdNameReference';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class Dealer {
  static async fromDealerInput(session: IDocumentSession, data: DealerInput, user: JwtUser) {
    let dealer: Dealer;
    const { id, ...rest } = data;
    if (data.location) data.location.id = id ? id : shortid.generate(); // Needs id for antd location column to work
    // TODO : need to explore this line above.
    if (data.id) {
      dealer = await session.load(data.id);
    } else {
      dealer = new this(data.name, data.location, data.phones, data.sales, data.service, data.parts);
      dealer.client = await IdNameReference.clientFromJwtUser(session, user);
      dealer.createdOn = DateTime.utc().toJSDate();
    }
    Object.assign(dealer, { ...rest, updatedOn: DateTime.utc().toJSDate() });
    return dealer;
  }

  @Field()
  public name: string;

  @Field({ nullable: true })
  public website?: string;

  @Field({ nullable: true })
  public email?: string;

  @Field({ nullable: true })
  public location?: DealerAddress;

  @Field(() => [DealerPhone], { nullable: true })
  public phones?: DealerPhone[];

  @Field(() => [DealerContact], { nullable: true })
  public sales?: DealerContact[];

  @Field(() => [DealerContact], { nullable: true })
  public service?: DealerContact[];

  @Field(() => [DealerContact], { nullable: true })
  public parts?: DealerContact[];

  // @Field({ nullable: true })
  // public service?: DealerUserReference;

  // @Field({ nullable: true })
  // public parts?: DealerUserReference;

  @Field(() => IdNameReference, { nullable: true })
  public client?: IdNameReference;

  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  updatedOn?: Date;

  constructor(name: string, location: DealerAddress, phones: DealerPhone[], sales: DealerContact[], service: DealerContact[], parts: DealerContact[]) {
    this.name = name;
    this.location = location;
    this.phones = phones;
    this.sales = sales;
    this.service = service;
    this.parts = parts;
  }
}

export class MachineDealerInfo {
  // whoBoughtFrom = dealer = sales, service and parts
  filler: boolean;
}
