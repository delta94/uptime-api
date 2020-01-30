import { DateTime } from 'luxon';
import { IDocumentSession } from 'ravendb';
import { ObjectType, Field, ID } from 'type-graphql';
import { Make } from './Make';

@ObjectType()
export class MakeReference {
  static fromManufacturer(session: IDocumentSession, data: Make) {
    return new this(data.id, data.name);
  }

  @Field({ nullable: true })
  public id?: string;

  @Field()
  public name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
