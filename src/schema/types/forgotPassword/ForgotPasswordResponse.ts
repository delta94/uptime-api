import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ForgotPasswordResponse {
  @Field()
  public status: boolean;
}
