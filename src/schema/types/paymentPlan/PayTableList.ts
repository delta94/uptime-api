import { ObjectType, Field, Int } from 'type-graphql';
import { PaymentPlan } from './PaymentPlan';
@ObjectType()
export class PayTableList {
  
  @Field(() => [PaymentPlan])
  paymentPlans: PaymentPlan[];
  
  @Field(() => Int)
  totalRows: number;
}
