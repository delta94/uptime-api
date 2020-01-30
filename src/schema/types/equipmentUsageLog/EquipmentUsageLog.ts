import { DateTime } from 'luxon';
import { ObjectType, Field, ID, Int, Float } from 'type-graphql';
import { UserReference } from '../user/UserReference';
import { BasicOfficeLocationReference } from '../officeLocation/BasicOfficeLocationReference';
import { JobReference } from '../job/JobReference';
import { DetailedEquipmentReference } from '../equipment/DetailedEquipmentReference';
import { IdNameReference } from '../common/IdNameReference';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class EquipmentUsageLog {
  static fromData(
    who: UserReference,
    equipment: DetailedEquipmentReference,
    client: IdNameReference,
    estimateUsage: number,
    meterValueIn: number,
    type: 'Pre-Shift' | 'Post-Shift'
  ) {
    let entity: EquipmentUsageLog;

    entity = new this(who, equipment, client, estimateUsage, meterValueIn, type, null, null);

    entity.createdOn = DateTime.utc().toJSDate();
    entity.updatedOn = DateTime.utc().toJSDate();

    return entity;
  }

  @Field(() => UserReference)
  who: UserReference;

  @Field(() => String)
  public type: 'Pre-Shift' | 'Post-Shift';

  @Field(() => DetailedEquipmentReference)
  equipment: DetailedEquipmentReference;

  @Field(() => IdNameReference, { nullable: true })
  client?: IdNameReference;

  @Field(() => IdNameReference, { nullable: true })
  public officeLocation?: IdNameReference;

  @Field(() => JobReference, { nullable: true })
  public job?: JobReference;

  @Field(() => Float)
  estimateUsage: number;

  @Field(() => Float, { nullable: true })
  public actualUsage?: number;

  @Field(() => Float)
  public percentage?: number;

  @Field(() => Float)
  meterValueIn: number;

  @Field(() => Float)
  public meterValueOut?: number;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  public updatedOn?: Date;

  constructor(
    who: UserReference,
    equipment: DetailedEquipmentReference,
    client: IdNameReference,
    estimateUsage: number,
    meterValueIn: number,
    type: 'Pre-Shift' | 'Post-Shift',
    officeLocation: BasicOfficeLocationReference,
    job: JobReference
  ) {
    this.who = who;
    this.equipment = equipment;
    this.client = client;
    this.estimateUsage = estimateUsage;
    this.meterValueIn = meterValueIn;
    this.type = type;
    this.officeLocation = officeLocation;
    this.job = job;
  }
}
