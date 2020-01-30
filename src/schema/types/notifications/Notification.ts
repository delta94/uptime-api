import { ObjectType, Field, ID, Int } from 'type-graphql';
import { UserReference } from '../user/UserReference';
import { getNowUtc } from '@/helpers/utils';
import { IdNameReference } from '../common/IdNameReference';
import { DetailedEquipmentReference } from '../equipment/DetailedEquipmentReference';
import { OfficeLocationReference } from '../officeLocation/OfficeLocationReference';
import { JobReference } from '../job/JobReference';
import { ServiceIntervalReference } from '../serviceInterval/ServiceIntervalReference';
import { InspectionReference } from '../inspection/InspectionReference';
import { ServiceIntervalNotificationReference } from '../serviceInterval/ServiceIntervalNotificationReference';
import { NotificationSourceEnum, NotificationTypeEnum } from '../Enums';
import { OfficeLocation } from '../officeLocation/OfficeLocation';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class Notification {
  //   static async fromNotificationInput(session: IDocumentSession, data: NotificationInput) {
  //     let loc: Notification;
  //     const { id, ...rest } = data;

  //     if (data.id) {
  //       loc = await session.load(data.id);
  //     } else {
  //       loc = new this(capitalizeEachFirstLetter(data.name), data.addresses, data.phones, data.operators, data.mechanics);
  //       loc.createdOn = DateTime.utc().toJSDate();
  //     }
  //     Object.assign(loc, { ...rest, updatedOn: DateTime.utc().toJSDate() });
  //     return loc;
  //   }

  //   static async fromNotificationInputs(session: IDocumentSession, data: NotificationInput[]): Promise<Notification[]> {
  //     const locations: Notification[] = [];
  //     for (const loc of data) {
  //       locations.push(await this.fromNotificationInput(session, loc));
  //     }
  //     return locations;
  //   }

  @Field(() => ID)
  public readonly id: string;

  @Field(() => NotificationTypeEnum, { defaultValue: NotificationTypeEnum.WorkOrder })
  public type: NotificationTypeEnum;

  @Field(() => NotificationSourceEnum)
  public notificationSource: NotificationSourceEnum;

  @Field(() => IdNameReference)
  public client: IdNameReference;

  @Field(() => OfficeLocationReference)
  public officeLocation: OfficeLocationReference;

  @Field(() => JobReference)
  public job?: JobReference;

  @Field(() => [UserReference], { nullable: true })
  public alertedUsers: UserReference[];

  @Field(() => DetailedEquipmentReference, { nullable: true })
  public equipment: DetailedEquipmentReference;

  @Field({ nullable: true, defaultValue: false })
  public oneTime: boolean;

  @Field(() => InspectionReference, { nullable: true })
  public inspection?: InspectionReference;

  @Field(() => ServiceIntervalReference, { nullable: true })
  public serviceInterval?: ServiceIntervalNotificationReference;

  @Field({ nullable: true })
  public workOrderId?: string;

  @Field({ nullable: true })
  public fluidReportId?: string;

  @Field(() => Int, { nullable: true })
  public milestoneMeterValue?: number;

  @Field(() => Int, { nullable: true })
  public milestoneMeterValueMultiplier?: number;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  updatedOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  viewedOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  completedOn?: Date;

  constructor(
    notificationSource: NotificationSourceEnum,
    type: NotificationTypeEnum,
    client: IdNameReference,
    equipment: DetailedEquipmentReference,
    alertedUsers: UserReference[],
    officeLocation: OfficeLocationReference,
    job?: JobReference,
    oneTime?: boolean,
    milestoneMeterValue?: number,
    serviceInterval?: ServiceIntervalNotificationReference,
    milestoneMeterValueMultiplier?: number
  ) {
    this.notificationSource = notificationSource;
    this.type = type;
    this.client = client;
    this.equipment = equipment;
    this.alertedUsers = alertedUsers;
    this.officeLocation = officeLocation;
    this.oneTime = oneTime;
    this.milestoneMeterValue = milestoneMeterValue;
    this.milestoneMeterValueMultiplier = milestoneMeterValueMultiplier;
    this.serviceInterval = serviceInterval;
    this.job = job;
    this.createdOn = getNowUtc();
  }
}
