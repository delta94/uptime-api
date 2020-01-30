import { Field, ObjectType, InputType, Float } from 'type-graphql';

@InputType()
export class ServiceIntervalReferenceInput {
  @Field()
  public id: string;

  @Field()
  public title: string;
}
