import { Field, ObjectType, InputType, Float } from 'type-graphql';
@ObjectType()
export class ServiceReference {
  @Field()
  public id: string;

  @Field(() => Float)
  public operatingHours: number;

  @Field()
  public title: string;
}
