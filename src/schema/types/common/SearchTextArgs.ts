import { Field, ArgsType } from 'type-graphql';

@ArgsType()
export class SearchTextArgs {
  @Field({ nullable: true, defaultValue: '' })
  searchText?: string;
}
