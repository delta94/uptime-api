import { DateTime } from 'luxon';
import { ObjectType, Field, ID } from 'type-graphql';
import { Equipment } from '../equipment/Equipment';
import { Address } from '../client/Address';
import { UserReference } from '../user/UserReference';
import { EquipmentReference } from '../equipment/EquipmentReference';
import { OfficeLocationReference } from '../officeLocation/OfficeLocationReference';
import { IdNameReference } from '../common/IdNameReference';
import { JobInput } from './JobInput';
import { IDocumentSession } from 'ravendb';
import { getNowUtc } from '@/helpers/utils';
import { EquipmentReferenceInput } from '../equipment/EquipmentReferenceInput';
import { DetailedEquipmentReference } from '../equipment/DetailedEquipmentReference';
import { OfficeLocation } from '../officeLocation/OfficeLocation';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class Job {
  static async fromJobInput(session: IDocumentSession, data: JobInput) {
    let job: Job;
    const { id, ...rest } = data;
    if (data.id) {
      job = await session.load<Job>(data.id);
    } else {
      job = new this(
        data.name,
        data.addresses,
        DetailedEquipmentReference.fromDetailedEquipmentReferenceInputs(data.equipment),
        data.startDate,
        data.endDate,
        data.notificationUsers
      );
      job.createdOn = getNowUtc();
    }
    Object.assign(job, { ...rest, updatedOn: getNowUtc() });
    return job;
  }

  @Field()
  public jobNumber: string;

  @Field()
  public name: string;

  @Field(() => IdNameReference)
  public client: IdNameReference;

  @Field(() => IdNameReference)
  public officeLocation: IdNameReference;

  @Field(() => UserReference)
  public foreman: UserReference;

  @Field(() => [Address!])
  public addresses: Address[];

  @Field(() => [DetailedEquipmentReference!])
  public equipment: DetailedEquipmentReference[];

  @Field(() => [UserReference!])
  public operators: UserReference[];

  @Field(() => [UserReference!])
  public mechanics: UserReference[];

  @Field(() => [UserReference!], { nullable: true, defaultValue: [] })
  public notificationUsers?: UserReference[];

  @Field({ nullable: true })
  public startDate?: Date;

  @Field({ nullable: true })
  public endDate?: Date;

  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  updatedOn?: Date;

  constructor(name: string, addresses: Address[], equipment: DetailedEquipmentReference[], startDate: Date, endDate: Date, notificationUsers: UserReference[]) {
    this.name = name;
    this.addresses = addresses;
    this.equipment = equipment;
    this.startDate = startDate;
    this.endDate = endDate;
    this.notificationUsers = notificationUsers;
  }
}
