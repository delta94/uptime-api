import { ObjectType, InputType, Field } from 'type-graphql';
@InputType()
export class InspectionTemplateReferenceInput {
  @Field()
  id: string;

  @Field()
  title: string;
}
