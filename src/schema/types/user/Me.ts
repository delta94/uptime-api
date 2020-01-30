import { Field, ObjectType, InputType } from 'type-graphql';
import { Phone } from '../client/Phone';
import { UserRoleReference } from '../role/UserRoleReference';

@ObjectType()
export class Me {
  @Field()
  public id: string;

  @Field()
  public firstName: string;

  @Field()
  public lastName: string;

  @Field()
  public email: string;

  @Field(() => [Phone])
  public phone: Phone[];

  @Field(() => [UserRoleReference])
  public roles: UserRoleReference[];
}
