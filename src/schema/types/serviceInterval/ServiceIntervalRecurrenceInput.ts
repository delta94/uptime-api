import { Field, Int, InputType } from 'type-graphql';
import { ServiceIntervalServiceItemInput } from './ServiceIntervalServiceItemInput';
@InputType()
export class ServiceIntervalRecurrenceInput {  
  @Field()
  public title: string;

  @Field()
  public description: string;

  @Field(() => Int)
  public alertBeforeDue: number;

  @Field(() => Int)
  public meterValue: number;

  @Field(() => [ServiceIntervalServiceItemInput], { nullable: true, defaultValue: [] })
  public serviceItems: ServiceIntervalServiceItemInput[];
}
