import { Field, ObjectType, ArgsType } from 'type-graphql';

@ArgsType()
export class UserByClientIdArgs {
  @Field()
  clientId: string;

  @Field({ nullable: true })
  searchText?: string;

  @Field({ nullable: true })
  role?: string;
}
