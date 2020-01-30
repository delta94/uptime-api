import { ObjectType, InputType, Field } from 'type-graphql';
@ObjectType()
export class PaymentPlanReference {
  @Field()
  public id: string;

  @Field()
  public name: string;
}
