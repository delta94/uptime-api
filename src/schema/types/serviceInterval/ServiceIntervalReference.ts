import { Field, ObjectType, InputType, Float } from 'type-graphql';
@ObjectType()
export class ServiceIntervalReference {
  @Field()
  public id: string;

  @Field()
  public title: string;
}
