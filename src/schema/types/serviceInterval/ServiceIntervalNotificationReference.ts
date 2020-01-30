import { Field, ObjectType, InputType, Float } from 'type-graphql';
import { ServiceIntervalMilestoneReference } from './ServiceIntervalMilestoneReference';
@ObjectType()
export class ServiceIntervalNotificationReference {
  @Field()
  public id: string;

  @Field()
  public title: string;

  @Field()
  public milestone: ServiceIntervalMilestoneReference;

  @Field(() => Float)
  public currentMeterValue: number;

  @Field()
  public meterType: string;

  constructor(id: string, title: string, milestone: ServiceIntervalMilestoneReference, currentMeterValue: number, meterType: string) {
    this.id = id;
    this.title = title;
    this.milestone = milestone;
    this.currentMeterValue = currentMeterValue;
    this.meterType = meterType;
  }
}
