import { ObjectType, InputType, Field } from 'type-graphql';

@InputType()
export class MakeReferenceInput {
  @Field({ nullable: true })
  public id?: string;
  @Field()
  public name: string;
}
