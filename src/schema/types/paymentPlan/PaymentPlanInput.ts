import { DateTime } from 'luxon';
import { IDocumentSession } from 'ravendb';
import { ObjectType, InputType, Field, ID, Float, Int } from 'type-graphql';
import { BillingPeriodEnum, DiscountTypeEnum } from '../Enums';

@InputType()
export class PaymentPlanInput {
  @Field()
  public name: string;

  @Field(() => Int)
  public minimumUsers: number;

  @Field(() => Int)
  public maximumUsers: number;

  @Field(() => Float)
  public pricePerUser: number;

  @Field(() => Float)
  public onboardingFeePerUser: number;

  @Field(() => BillingPeriodEnum)
  public billingPeriod?: BillingPeriodEnum;

  @Field(() => Float)
  public maintenanceFee?: number;

  @Field(() => Int)
  public discountAmount?: number;

  @Field(() => DiscountTypeEnum)
  public discountType?: DiscountTypeEnum;

  @Field(() => ID, { nullable: true })
  public readonly id?: string;
}
