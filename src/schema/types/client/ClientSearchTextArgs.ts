import { Field, ArgsType } from 'type-graphql';

@ArgsType()
export class ClientSearchTextArgs {
  @Field({ nullable: true, defaultValue: '' })
  searchText?: string;

  @Field()
  clientId?: string;

  @Field()
  classification?: string;
}
