import { Field, ArgsType } from 'type-graphql';
@ArgsType()
export class PrintArgs {
  @Field(type => [String])
  selectedInspections: String[];
}
