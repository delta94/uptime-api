import { Field, ObjectType } from 'type-graphql';
import { User } from './User';
import { IDocumentSession } from 'ravendb';
import { JwtUser } from '../JwtUser';

@ObjectType()
export class UserReference {
  static fromUser(data: User) {
    return new this(data.id, data.firstName, data.lastName, data.email);
  }

  static async fromJwtUser(session: IDocumentSession, data: JwtUser) {
    const user = await session.load<User>(data.id);
    return new this(user.id, user.firstName, user.lastName, user.email);
  }

  @Field()
  public id: string;

  @Field()
  public firstName: string;

  @Field()
  public lastName: string;

  @Field()
  public email: string;

  constructor(id: string, firstName: string, lastName: string, email: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}
