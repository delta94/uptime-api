import { Field, InputType } from 'type-graphql';

@InputType()
export class UserReferenceInput {
  @Field()
  public id: string;

  @Field()
  public firstName: string;

  @Field()
  public lastName: string;

  @Field()
  public email: string;
}
