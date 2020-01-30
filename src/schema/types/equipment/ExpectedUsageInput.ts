import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class ExpectedUsageInput {
  @Field(() => Int)
  mon: number;

  @Field(() => Int)
  tue: number;

  @Field(() => Int)
  wed: number;

  @Field(() => Int)
  thu: number;

  @Field(() => Int)
  fri: number;

  @Field(() => Int)
  sat: number;

  @Field(() => Int)
  sun: number;

  [key: string]: number; // To be able to access properties directly ex: expUsage['mon']
}
