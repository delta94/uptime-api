import { Field, InputType, Float, ID } from 'type-graphql';
import { ServiceIntervalMilestoneInput } from './ServiceIntervalMilestoneInput';
import { IdNameReferenceInput } from '../common/IdNameReferenceInput';

@InputType()
export class ServiceIntervalInput {
  @Field(() => ID, { nullable: true })
  readonly id?: string;

  @Field()
  public title: string;

  @Field()
  public make: string;

  @Field()
  public model: string;

  @Field()
  public meterType: string;

  @Field(() => [ServiceIntervalMilestoneInput], { nullable: true })
  public milestones?: ServiceIntervalMilestoneInput[];

  @Field(() => IdNameReferenceInput, { nullable: true })
  public client?: IdNameReferenceInput;
}
