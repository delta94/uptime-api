import { ObjectType, Field, ID } from 'type-graphql';
import { IDocumentSession } from 'ravendb';
import session = require('express-session');
import { JwtUser } from '../JwtUser';
import { Client } from '../client/Client';

@ObjectType()
export class IdNameReference {
  static fromIdAndNameType<T extends { id?: string; name: string }>(data: T): IdNameReference {
    return new this(data.id, data.name);
  }

  static fromIdAndNameTypes<T extends { id?: string; name: string }>(data: T[]): IdNameReference[] {
    return data.map(t => this.fromIdAndNameType(t));
  }

  static async clientFromJwtUser(session: IDocumentSession, data: JwtUser): Promise<IdNameReference> {
    if (data.clientId) {
      const client = await session.load<Client>(data.clientId!);
      return new this(client.id, client.name);
    }
    return null;
  }

  @Field()
  public name: string;

  @Field(() => ID)
  public id: string;

  constructor(id: string, name: string) {
    this.name = name;
    this.id = id;
  }
}
