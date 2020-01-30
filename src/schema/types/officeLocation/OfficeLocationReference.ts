import { DateTime } from 'luxon';
import { ObjectType, Field, ID } from 'type-graphql';
import { IDocumentSession } from 'ravendb';
import { OfficeLocationInput } from './OfficeLocationInput';
import { OfficeLocation } from './OfficeLocation';
import { OfficeLocationReferenceInput } from './OfficeLocationReferenceInput';
import { IdNameReference } from '../common/IdNameReference';
import { UserReference } from '../user/UserReference';

@ObjectType()
export class OfficeLocationReference {
  static async fromOfficeLocationInput(data: OfficeLocationInput): Promise<OfficeLocationReference> {
    return new this(data.id, data.name, data.client, data.notificationUsers);
  }

  static fromOfficeLocation(data: OfficeLocation): OfficeLocationReference {
    return new this(data.id, data.name, data.client, data.notificationUsers);
  }

  @Field()
  public name: string;

  @Field(() => IdNameReference)
  public client: IdNameReference;

  @Field(() => ID)
  public id: string;

  @Field(() => [UserReference!], { nullable: true, defaultValue: [] })
  public notificationUsers?: UserReference[];

  constructor(id: string, name: string, client: IdNameReference, notificationUsers: UserReference[]) {
    this.name = name;
    this.id = id;
    this.client = client;
    this.notificationUsers = notificationUsers;
  }
}
