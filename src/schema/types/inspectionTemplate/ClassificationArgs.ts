import { Field, ArgsType } from 'type-graphql';

@ArgsType()
export class ClassificationArgs {
  @Field()
  public classification: string;
}
