import { Field, InputType, Int } from 'type-graphql';
import { ServiceIntervalServiceItemInput } from './ServiceIntervalServiceItemInput';

@InputType()
export class ServiceIntervalMilestoneInput {
  @Field()
  public id: number;

  @Field()
  public title: string;

  @Field({ nullable: true })
  public oneTime?: boolean;

  @Field(() => Int)
  public alertBeforeDue: number;

  @Field(() => Int)
  public meterValue: number;

  @Field(() => [ServiceIntervalServiceItemInput], { nullable: true, defaultValue: [] })
  public serviceItems: ServiceIntervalServiceItemInput[];
}
