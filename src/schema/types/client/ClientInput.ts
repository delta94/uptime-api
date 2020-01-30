import { v4 } from 'uuid';
import { Field, ID, InputType } from 'type-graphql';
import { PaymentPlanReferenceInput } from '../paymentPlan/PaymentPlanReferenceInput';
import { ClientRolesInput } from './ClientRolesInput';

@InputType()
export class ClientInput {
  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  @Field()
  public name: string;

  @Field()
  public loginDomain: string;

  @Field({ nullable: true, defaultValue: v4() })
  public uuid: string;

  @Field({ nullable: true })
  public paymentPlan?: PaymentPlanReferenceInput;

  @Field({ nullable: true })
  public website?: string;

  @Field({ nullable: true, defaultValue: [] })
  public roles?: ClientRolesInput;
}
