import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class InspectionChart {
  @Field()
  public id: string;

  @Field()
  public firstName: string;

  @Field()
  public lastName: string;

  @Field()
  public fullName: string;

  @Field(() => Int)
  public total: number;
}
