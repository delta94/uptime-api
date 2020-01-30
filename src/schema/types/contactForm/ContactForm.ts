import { ObjectType, ID } from 'type-graphql';
import { Field } from 'type-graphql/dist/decorators/Field';
import GraphQLJSON from 'graphql-type-json';
import { UserReference } from '../user/UserReference';
import { IDocumentSession } from 'ravendb';
import { DateTime } from 'luxon';
import { JwtUser } from '../JwtUser';
import { User } from '../user/User';
import { IdNameReference } from '../common/IdNameReference';
import { IsoDateTime } from 'schema/scalars/date';
import { ContactFormInput } from './ContactFormInput';
import { getNowUtc } from '@/helpers/utils';

@ObjectType()
export class ContactForm {
  static async fromContactFormInput(session: IDocumentSession, data: ContactFormInput) {
    let entity: ContactForm;
    const { id, ...rest } = data;
    if (data.id) {
      entity = await session.load<ContactForm>(data.id);
    } else {
      entity = new this(data.name, data.email, data.message);
      entity.createdOn = getNowUtc();
    }
    Object.assign(entity, { ...rest, updatedOn: getNowUtc() });
    return entity;
  }

  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  message: string;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  updatedOn: Date;

  constructor(name: string, email: string, message: string) {
    this.name = name;
    this.email = email;
    this.message = message;
  }
}
