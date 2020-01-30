import { Field, ObjectType, Int } from 'type-graphql';
import { ServiceIntervalServiceItem } from './ServiceIntervalServiceItem';
import { IDocumentSession } from 'ravendb';
import { ServiceIntervalInput } from './ServiceIntervalInput';
import { ServiceInterval } from './ServiceInterval';
import { DateTime } from 'luxon';
import { ServiceIntervalMilestoneInput } from './ServiceIntervalMilestoneInput';
import { getShortUuid } from '@/helpers/utils';

@ObjectType()
export class ServiceIntervalMilestone {
  static fromServiceIntervalMilestoneInput(data: ServiceIntervalMilestoneInput) {
    let serviceIntervalMilestone: ServiceIntervalMilestone;
    serviceIntervalMilestone = new this(data.id, data.title, data.oneTime, data.alertBeforeDue, data.meterValue, data.serviceItems);
    return serviceIntervalMilestone;
  }

  static fromServiceIntervalMilestoneInputs(data: ServiceIntervalMilestoneInput[]) {
    return data.map(m => this.fromServiceIntervalMilestoneInput(m));
  }

  @Field()
  public title: string;

  @Field({ nullable: true, defaultValue: false })
  public oneTime?: boolean;

  @Field(() => Int)
  public alertBeforeDue: number;

  @Field(() => Int)
  public meterValue: number;

  @Field(() => [ServiceIntervalServiceItem], { nullable: true, defaultValue: [] })
  public serviceItems: ServiceIntervalServiceItem[];

  @Field({ nullable: true })
  public id?: number;

  constructor(id: number, title: string, oneTime: boolean, alertBeforeDue: number, meterValue: number, serviceItems: ServiceIntervalServiceItem[]) {
    this.id = id;
    this.title = title;
    this.oneTime = oneTime;
    this.alertBeforeDue = alertBeforeDue;
    this.meterValue = meterValue;
    this.serviceItems = serviceItems;
  }
}
