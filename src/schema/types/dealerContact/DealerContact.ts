import { DateTime } from 'luxon';
import { ObjectType, Field, ID } from 'type-graphql';
import { DealerPhone } from '../dealer/DealerPhone';
import { IDocumentSession } from 'ravendb';
import { JwtUser } from '../JwtUser';
import { DealerContactInput } from './DealerContactInput';
import { capitalizeEachFirstLetter } from '@/helpers/utils';
import { IdNameReference } from '../common/IdNameReference';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class DealerContact {
  static async fromDealerContactInput(session: IDocumentSession, data: DealerContactInput, user: JwtUser) {
    let dealerContact: DealerContact;
    const { id, ...rest } = data;

    if (data.id) {
      dealerContact = await session.load(data.id);
    } else {
      dealerContact = new this(
        capitalizeEachFirstLetter(data.firstName),
        capitalizeEachFirstLetter(data.lastName),
        data.email.toLowerCase(),
        data.representativeType,
        data.phone
      );
      dealerContact.client = await IdNameReference.clientFromJwtUser(session, user);
      dealerContact.createdOn = DateTime.utc().toJSDate();
    }
    Object.assign(dealerContact, { ...rest, updatedOn: DateTime.utc().toJSDate() });
    return dealerContact;
  }

  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  @Field()
  public firstName: string;

  @Field()
  public lastName: string;

  @Field({ nullable: true })
  public email?: string;

  @Field(() => DealerPhone, { nullable: true })
  public phone?: DealerPhone;

  @Field()
  public representativeType: string; // can't use type strange error on front ?

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  updatedOn?: Date;

  @Field(() => IdNameReference, { nullable: true })
  public client?: IdNameReference;

  constructor(firstName: string, lastName: string, email: string, representativeType: string, phone: DealerPhone) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.email = email;
    this.representativeType = representativeType;
  }
}
