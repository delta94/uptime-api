import { Field, InputType, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class ExpectedUsage {
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
