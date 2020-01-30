import { Field, ObjectType, Int } from 'type-graphql';
import { ServiceIntervalServiceItem } from './ServiceIntervalServiceItem';
import { IDocumentSession } from 'ravendb';
import { ServiceIntervalInput } from './ServiceIntervalInput';
import { ServiceInterval } from './ServiceInterval';
import { DateTime } from 'luxon';
import { ServiceIntervalMilestoneInput } from './ServiceIntervalMilestoneInput';
import { getShortUuid } from '@/helpers/utils';
import { ServiceIntervalMilestone } from './ServiceIntervalMilestone';

@ObjectType()
export class ServiceIntervalMilestoneReference {
  @Field()
  public id: string;

  @Field()
  public title: string;

  @Field({ nullable: true })
  public oneTime?: boolean;

  @Field({ nullable: true })
  public serviceDue?: boolean;

  @Field({ nullable: true })
  public alertBeforeServiceDue?: boolean;

  constructor(id: string, title: string, oneTime: boolean, serviceDue: boolean, alertBeforeServiceDue: boolean) {
    this.id = id;
    this.title = title;
    this.oneTime = oneTime;
    this.serviceDue = serviceDue;
    this.alertBeforeServiceDue = alertBeforeServiceDue;
  }
}
