import { Field, ObjectType } from 'type-graphql';
import { UserReference } from '../user/UserReference';
import { getNowUtc, getShortUuid } from '@/helpers/utils';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class WorkOrderHistoryItem {
  @Field()
  id: string;

  @Field()
  message: string;

  @Field(() => UserReference)
  user: UserReference;

  @Field(() => IsoDateTime)
  enteredOn: Date;

  constructor(message: string, user: UserReference) {
    this.id = getShortUuid();
    this.enteredOn = getNowUtc();
    this.message = message;
    this.user = user;
  }
}
