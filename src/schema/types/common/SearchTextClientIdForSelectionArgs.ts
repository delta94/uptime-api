import { Field, ArgsType } from 'type-graphql';

@ArgsType()
export class SearchTextClientIdForSelectionArgs {
  @Field({ nullable: true, defaultValue: '' })
  searchText?: string;

  @Field()
  clientId: string;
}
