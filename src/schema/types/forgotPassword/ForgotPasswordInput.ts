import { DateTime } from 'luxon';
import { Field, InputType, ID } from 'type-graphql';

@InputType()
export class ForgotPasswordInput {
  @Field()
  public email: string;
}
