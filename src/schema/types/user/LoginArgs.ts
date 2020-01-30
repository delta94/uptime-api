import { Field, ArgsType } from 'type-graphql';
@ArgsType()
export class LoginArgs {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  uuid: string;
}
