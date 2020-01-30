import { DateTime } from 'luxon';
import { v4 } from 'uuid';
import { IDocumentSession } from 'ravendb';
import { Field, ObjectType, ID } from 'type-graphql';
import { ClientRoles } from './ClientRoles';
import { PaymentPlanReference } from '../paymentPlan/PaymentPlanReference';
import { Ancestry } from './Ancestry';
import { ClientInput } from './ClientInput';
import { getShortUuid, capitalizeEachFirstLetter } from '@/helpers/utils';
import { Address } from './Address';
import { Phone } from './Phone';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class Client {
  static async fromClientInput(session: IDocumentSession, data: ClientInput) {
    let client: Client;
    const { id, ...rest } = data;
    if (data.id) {
      client = await session.load<Client>(id);
    } else {
      client = new this(capitalizeEachFirstLetter(data.name), data.loginDomain.toLowerCase());
      client.createdOn = DateTime.utc().toJSDate();
    }
    Object.assign(client, { ...rest, updatedOn: DateTime.utc().toJSDate() });
    return client;
  }

  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  @Field()
  public name: string;

  @Field()
  public loginDomain: string;

  @Field({ nullable: true, defaultValue: getShortUuid() })
  public uuid: string;

  @Field({ nullable: true })
  public paymentPlan?: PaymentPlanReference;

  @Field({ nullable: true })
  public website?: string;

  @Field({ nullable: true, defaultValue: new Ancestry(1, '') })
  public ancestry?: Ancestry;

  @Field({ nullable: true, defaultValue: [] })
  public roles?: ClientRoles;

  @Field(() => [Phone], { nullable: true, defaultValue: [] })
  public phones?: Phone[];

  @Field(() => [Address], { nullable: true, defaultValue: [] })
  public addresses?: Address[];

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  updatedOn?: Date;

  constructor(name: string, loginDomain: string) {
    this.name = name;
    this.loginDomain = loginDomain;
  }
}
