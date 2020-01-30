import { Field, ObjectType, Int } from 'type-graphql';
import { ServiceIntervalServiceItem } from './ServiceIntervalServiceItem';
import { ServiceIntervalRecurrenceInput } from './ServiceIntervalRecurrenceInput';

@ObjectType()
export class ServiceIntervalRecurrence {
  static fromServiceIntervalRecurrenceInput(data: ServiceIntervalRecurrenceInput) {
    let serviceIntervalRecurrence: ServiceIntervalRecurrence;
    serviceIntervalRecurrence = new this(data.title, data.description, data.alertBeforeDue, data.meterValue, data.serviceItems);
    return serviceIntervalRecurrence;
  }

  static fromServiceIntervalRecurrenceInputs(data: ServiceIntervalRecurrenceInput[]) {
    return data.map(r => this.fromServiceIntervalRecurrenceInput(r));
  }

  @Field()
  public title: string;

  @Field()
  public description: string;

  @Field(() => Int)
  public alertBeforeDue: number;

  @Field(() => Int)
  public meterValue: number;

  @Field(() => [ServiceIntervalServiceItem], { nullable: true, defaultValue: [] })
  public serviceItems: ServiceIntervalServiceItem[];

  constructor(title: string, description: string, alertBeforeDue: number, meterValue: number, serviceItems: ServiceIntervalServiceItem[]) {
    this.title = title;
    this.description = description;
    this.alertBeforeDue = alertBeforeDue;
    this.meterValue = meterValue;
    this.serviceItems = serviceItems;
  }
}
