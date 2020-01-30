import { Field, ObjectType } from 'type-graphql';
import { User } from './User';
import { UserRoleReference } from '../role/UserRoleReference';
import { UserInput } from './UserInput';
import { IdNameReference } from '../common/IdNameReference';

@ObjectType()
export class LoggedInUser {
  static async fromUser(data: User) {
    return new this(data.id, data.firstName, data.lastName, data.email, data.timezone, data.roles, data.client);
  }
  static async fromUserInput(data: UserInput) {
    return new this(data.id, data.firstName, data.lastName, data.email, data.timezone, data.roles, data.client);
  }

  @Field()
  public id: string;

  @Field()
  public firstName: string;

  @Field()
  public lastName: string;

  @Field()
  public email: string;

  @Field()
  public timezone: string;

  @Field({ defaultValue: 0 })
  public notificationCount: number;

  @Field(() => IdNameReference, { nullable: true })
  public client?: IdNameReference;

  @Field(() => [UserRoleReference])
  public roles: UserRoleReference[];

  constructor(id: string, firstName: string, lastName: string, email: string, timezone: string, roles: UserRoleReference[], client?: IdNameReference) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.timezone = timezone;
    this.roles = roles;
    this.client = client;
  }
}
