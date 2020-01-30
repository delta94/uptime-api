import { Field, ArgsType } from 'type-graphql';

@ArgsType()
export class ManufacturerModelSearchTextArgs {
  @Field()
  searchText: string;

  @Field({ nullable: true, defaultValue: '' })
  manufacturer?: string;
}
