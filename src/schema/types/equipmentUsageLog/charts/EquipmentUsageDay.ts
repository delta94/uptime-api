import { ObjectType, Field, Float } from 'type-graphql';

@ObjectType()
export class EquipmentUsageDay {
  @Field()
  public day: string;

  @Field(() => Float)
  public estimateUsage: number;

  @Field(() => Float, { nullable: true })
  public actualUsage: number;
}
