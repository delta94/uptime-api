import { Field, ArgsType } from 'type-graphql';

@ArgsType()
export class ServiceIntervalForSelectionArgs {
  @Field({ nullable: true, defaultValue: '' })
  searchText?: string;

  @Field()
  clientId?: string;
}
