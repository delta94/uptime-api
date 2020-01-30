import { Field, ArgsType } from 'type-graphql';

@ArgsType()
export class ClientNameArgs {
  @Field()
  public clientId: string;

  @Field()
  public name: string;
}
