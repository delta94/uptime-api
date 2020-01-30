import { ObjectType, InputType, Field } from 'type-graphql';

@InputType()
export class ManufacturerReferenceInput {
  @Field({ nullable: true })
  public id?: string;
  @Field()
  public brand: string;
}
