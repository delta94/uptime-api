import { Field, InputType } from 'type-graphql';
@InputType()
export class ClassificationInput {
  @Field()
  name: string;
}
