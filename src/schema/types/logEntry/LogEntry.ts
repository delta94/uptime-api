import { ObjectType, ID } from 'type-graphql';
import { Field } from 'type-graphql/dist/decorators/Field';
import GraphQLJSON from 'graphql-type-json';
import { UserReference } from '../user/UserReference';
import { IDocumentSession } from 'ravendb';
import { LogEntryInput } from './LogEntryInput';
import { DateTime } from 'luxon';
import { JwtUser } from '../JwtUser';
import { User } from '../user/User';
import { IdNameReference } from '../common/IdNameReference';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class LogEntry {
  static async fromLogEntryInput(session: IDocumentSession, data: LogEntryInput, jwtUser: JwtUser) {
    let entity: LogEntry;
    const { id, ...rest } = data;
    if (data.id) {
      entity = await session.load<LogEntry>(data.id);
    } else {
      const user = await User.fromJwtUser(session, jwtUser);
      entity = new this(data.hint, data.data, data.errorMessage, data.stackTrace, user.client ? user.client : null, UserReference.fromUser(user));
      entity.createdOn = DateTime.utc().toJSDate();
    }
    Object.assign(entity, { ...rest, updatedOn: DateTime.utc().toJSDate() });
    return entity;
  }

  @Field(() => ID)
  id: string;

  @Field()
  hint: string;

  @Field(() => GraphQLJSON)
  data: any;

  @Field({ nullable: true })
  errorMessage?: string;

  @Field({ nullable: true })
  stackTrace?: string;

  @Field(() => IdNameReference, { nullable: true })
  client?: IdNameReference;

  @Field(() => UserReference, { nullable: true })
  user?: UserReference;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn: Date;

  constructor(hint: string, data: any, errorMessage: string = '', stackTrace: string = '', client: IdNameReference = null, user: UserReference = null) {
    this.hint = hint;
    this.data = data;
    this.errorMessage = errorMessage;
    this.stackTrace = stackTrace;
    this.client = client;
    this.user = user;
  }
}
