import { Field, ObjectType, InputType, Float } from 'type-graphql';

@InputType()
export class ServiceReferenceInput {
  
  @Field()
  public id: string;
  
  @Field(() => Float)
  public operatingHours: number;
  
  @Field()
  public title: string;
}
