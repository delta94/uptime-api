import { Field, ID, ObjectType, Int } from 'type-graphql';
import { UserReference } from '../user/UserReference';
import { getNowUtc, getShortUuid } from '@/helpers/utils';
import moment = require('moment');
import { IsoDateTime } from 'schema/scalars/date';
import { WorkOrderStatusEnum } from '../Enums';

@ObjectType()
export class WorkEntry {
  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  @Field(() => UserReference, { nullable: true })
  public who?: UserReference;

  @Field(() => WorkOrderStatusEnum)
  public startStatus: WorkOrderStatusEnum;

  @Field(() => WorkOrderStatusEnum)
  public stoppedStatus: WorkOrderStatusEnum;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  startedOn: Date;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  stoppedOn?: Date;

  @Field(() => Int, { nullable: true })
  public timeInSeconds?: number; // stoppedOn - startedOn ... how many seconds was this entry?

  constructor(startedOn?: Date, who?: UserReference) {
    this.id = getShortUuid();
    this.startedOn = startedOn;
    this.who = who;
  }
}
