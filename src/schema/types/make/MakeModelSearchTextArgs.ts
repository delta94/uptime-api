import { Field, ArgsType } from 'type-graphql';

@ArgsType()
export class MakeModelSearchTextArgs {
  @Field()
  searchText: string;

  @Field({ nullable: true, defaultValue: '' })
  make?: string;
}
