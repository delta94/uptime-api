import { Field, InputType,  } from 'type-graphql';

@InputType()
export class ResetPasswordInput {
  @Field()
  public token: string;

  @Field()
  public password: string;

  @Field()
  public confirm: string;
}
