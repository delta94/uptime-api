import { ObjectType, InputType, Field } from 'type-graphql';

@InputType()
export class PaymentPlanReferenceInput {
  
  @Field()
  public id: string;
  
  @Field()
  public name: string;
}
