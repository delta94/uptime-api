import { DateTime } from 'luxon';
import { IDocumentSession } from 'ravendb';
import { Field, ID, Float, Int, ObjectType } from 'type-graphql';
import { BillingPeriodEnum, DiscountTypeEnum } from '../Enums';
import { PaymentPlanInput } from './PaymentPlanInput';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class PaymentPlan {
  static async fromPaymentPlanInput(session: IDocumentSession, data: PaymentPlanInput) {
    let paymentPlan: PaymentPlan;
    const { id, ...rest } = data;

    if (data.id) {
      paymentPlan = await session.load(data.id);
    } else {
      paymentPlan = new this(
        data.name,
        data.minimumUsers,
        data.maximumUsers,
        data.pricePerUser,
        data.onboardingFeePerUser,
        data.billingPeriod,
        data.maintenanceFee,
        data.discountAmount,
        data.discountType
      );
      paymentPlan.createdOn = DateTime.utc().toJSDate();
    }

    Object.assign(paymentPlan, { ...rest, updatedOn: DateTime.utc().toJSDate() });
    return paymentPlan;
  }

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

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  updatedOn?: Date;

  constructor(
    name: string,
    minimumUsers: number,
    maximumUsers: number,
    pricePerUser: number,
    onboardingFeePerUser: number,
    billingPeriod?: BillingPeriodEnum,
    maintenanceFee?: number,
    discountAmount?: number,
    discountType?: DiscountTypeEnum
  ) {
    this.name = name;
    this.minimumUsers = minimumUsers;
    this.maximumUsers = maximumUsers;
    this.pricePerUser = pricePerUser;
    this.onboardingFeePerUser = onboardingFeePerUser;
    this.billingPeriod = billingPeriod;
    this.maintenanceFee = maintenanceFee;
    this.discountAmount = discountAmount;
    this.discountType = discountType;
  }
}
