import { IDocumentSession } from 'ravendb';
import { Field, ObjectType, ID, Float, Int } from 'type-graphql';
import { UserReference } from '../user/UserReference';
import { WorkOrderStatusEnum } from '../Enums';
import { WorkOrderInput } from './WorkOrderInput';
import { JwtUser } from '../JwtUser';
import { User } from '../user/User';
import { ProblemReportInput } from './ProblemReportInput';
import { Equipment } from '../equipment/Equipment';
import { BasicOfficeLocationReference } from '../officeLocation/BasicOfficeLocationReference';
import { JobReference } from '../job/JobReference';
import { DetailedEquipmentReference } from '../equipment/DetailedEquipmentReference';
import { getNowUtc } from '@/helpers/utils';
import { IdNameReference } from '../common/IdNameReference';
import { InspectionReference } from '../inspection/InspectionReference';
import { WorkOrderStatusInput } from './WorkOrderStatusInput';
import { WorkOrderWorkItem } from './WorkOrderWorkItem';
import { ServiceIntervalReference } from '../serviceInterval/ServiceIntervalReference';
import { ServiceIntervalNotificationReference } from '../serviceInterval/ServiceIntervalNotificationReference';
import { InspectionNotificationReference } from '../inspection/InspectionNotificationReference';
import { WorkOrderHistoryItem } from './WorkOrderHistoryItem';
import { WorkEntry } from './WorkEntry';
import { StopWorkEntryInput } from './StopWorkEntryInput';
import { EquipmentPart } from '../equipment/EquipmentPart';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class WorkOrder {
  static async fromWorkOrderInput(session: IDocumentSession, data: WorkOrderInput, user: JwtUser): Promise<WorkOrder> {
    let workOrder: WorkOrder;
    const { id, photos, clientId, equipmentId, equipment, detailedEquipment, assignedToIds, ...rest } = data;
    if (data.id) {
      workOrder = await session.load(data.id);
      workOrder.equipment = await DetailedEquipmentReference.fromEquipmentReferenceInput(session, equipment);
    } else {
      workOrder = new this(
        data.equipment
          ? await DetailedEquipmentReference.fromEquipmentReferenceInput(session, data.equipment)
          : DetailedEquipmentReference.fromDetailedEquipmentReferenceInput(data.detailedEquipment),
        await IdNameReference.clientFromJwtUser(session, user),
        await UserReference.fromJwtUser(session, user),
        [],
        data.notes,
        data.status,
        null,
        null,
        data.meterValue
      );
      workOrder.createdOn = getNowUtc();
    }
    Object.assign(workOrder, {
      ...rest,
      workEntries: workOrder.workEntries ? workOrder.workEntries : [],
      totalTimeInSeconds: workOrder.totalTimeInSeconds ? workOrder.totalTimeInSeconds : 0,
      updatedOn: getNowUtc(),
    });

    if (!id && !data.client) {
      const who = await session.load<User>(user.id);
      workOrder.reportedBy = UserReference.fromUser(who);
      workOrder.client = who.client;
      if (!data.assignedTo || data.assignedTo.length === 0) {
        const equipment = await session.load<Equipment>(equipmentId);
        if (equipment) {
          workOrder.assignedTo = equipment.mechanics;
          workOrder.assignedOn = getNowUtc();
        }
      }
    }

    return workOrder;
  }

  static async fromProblemReportInput(session: IDocumentSession, data: ProblemReportInput, user: JwtUser): Promise<WorkOrder> {
    let workOrder: WorkOrder;
    const { id, equipment, detailedEquipment, ...rest } = data;

    if (data.id) {
      workOrder = await session.load(data.id);
      workOrder.equipment = data.equipment
        ? await DetailedEquipmentReference.fromEquipmentReferenceInput(session, data.equipment)
        : DetailedEquipmentReference.fromDetailedEquipmentReferenceInput(data.detailedEquipment);
    } else {
      workOrder = new this(
        data.equipment
          ? await DetailedEquipmentReference.fromEquipmentReferenceInput(session, data.equipment)
          : DetailedEquipmentReference.fromDetailedEquipmentReferenceInput(data.detailedEquipment),
        await IdNameReference.clientFromJwtUser(session, user),
        await UserReference.fromJwtUser(session, user),
        [],
        data.notes,
        WorkOrderStatusEnum.Open,
        null,
        null,
        data.meterValue ? data.meterValue : 0
      );
      workOrder.createdOn = getNowUtc();
    }
    Object.assign(workOrder, {
      ...rest,
      workEntries: workOrder.workEntries ? workOrder.workEntries : [],
      totalTimeInSeconds: workOrder.totalTimeInSeconds ? workOrder.totalTimeInSeconds : 0,
      updatedOn: getNowUtc(),
    });

    if (!id) {
      const who = await session.load<User>(user.id);
      workOrder.reportedBy = UserReference.fromUser(who);
      workOrder.client = who.client;
      if (!workOrder.assignedTo || workOrder.assignedTo.length === 0) {
        const equipment = await session.load<Equipment>(workOrder.equipment.id);
        if (equipment) {
          workOrder.assignedTo = equipment.mechanics;
          workOrder.assignedOn = getNowUtc();
        }
      }
    }

    if (workOrder) {
      const equipment = await session.load<Equipment>(workOrder.equipment.id);
      if (equipment) {
        if (data.meterValue && data.meterValue > 0) {
          if (equipment.meterType === 'Hours') {
            if (equipment.meterValue !== 0 && (equipment.meterValue > data.meterValue || data.meterValue - equipment.meterValue > 24))
              throw new Error(`${equipment!.meterType} are incorrect. Please re-enter.`);
          } else {
            if (equipment.meterValue !== 0 && (equipment.meterValue > data.meterValue || data.meterValue - equipment.meterValue > 600))
              throw new Error(`${equipment!.meterType} are incorrect. Please re-enter.`);
          }
          equipment.meterValue = data.meterValue ? data.meterValue : equipment.meterValue;
        } else {
          workOrder.meterValue = equipment.meterValue;
        }
      }
    }

    return workOrder;
  }

  static async fromWorkOrderStatusInput(session: IDocumentSession, data: WorkOrderStatusInput): Promise<WorkOrder> {
    let workOrder: WorkOrder;
    const { id, assignedTo, ...rest } = data;
    workOrder = await session.load(data.id);
    Object.assign(workOrder, { ...rest, updatedOn: getNowUtc() });

    if (assignedTo) {
      workOrder.assignedTo = assignedTo;
      if (!workOrder.assignedOn) {
        workOrder.assignedOn = getNowUtc();
      }
    }

    return workOrder;
  }

  static async fromWorkEntryInput(session: IDocumentSession, data: StopWorkEntryInput): Promise<WorkOrder> {
    let workOrder: WorkOrder;
    const { id, ...rest } = data;
    workOrder = await session.load(data.id);
    Object.assign(workOrder, { ...rest, updatedOn: getNowUtc() });
    return workOrder;
  }

  static async fromJwtUser(session: IDocumentSession, jwtUser: JwtUser): Promise<WorkOrder> {
    let workOrder: WorkOrder;
    const user = await session.load<User>(jwtUser.id);
    if (user) {
      workOrder = new this(null, user.client, UserReference.fromUser(user), [], '', WorkOrderStatusEnum.Open, null, null, 0);
      workOrder.createdOn = getNowUtc();
      workOrder.updatedOn = getNowUtc();
    }
    Object.assign(workOrder, { updatedOn: getNowUtc() });
    return workOrder;
  }

  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  @Field(() => ID, { nullable: true })
  public activeWorkEntryId?: string;

  @Field(() => [EquipmentPart], { defaultValue: [] })
  public parts: EquipmentPart[];

  @Field(() => DetailedEquipmentReference, { nullable: true })
  public equipment?: DetailedEquipmentReference;

  // If comes from a Service Interval, set this property
  @Field(() => ServiceIntervalNotificationReference, { nullable: true })
  public serviceInterval?: ServiceIntervalNotificationReference;

  // If comes from a Inspection, set this and all Checklist Items that shouldSendAlert, set this property
  @Field(() => InspectionNotificationReference, { nullable: true })
  public inspection?: InspectionNotificationReference;

  // This is where you add at least 1 thing that needs to be worked on
  // If from a Service Interval, the milestone service items
  // If from an Inspection, each and every shouldSendAlert checklistItems, 1 entry for each
  // If from a Problem Report, whatever created this work order, the message and phoot
  @Field(() => [WorkOrderWorkItem], { defaultValue: [] })
  public workItems: WorkOrderWorkItem[];

  @Field(() => IdNameReference)
  public client: IdNameReference;

  @Field(() => IdNameReference, { nullable: true })
  public officeLocation?: IdNameReference;

  @Field(() => JobReference, { nullable: true })
  public job?: JobReference;

  // This might seem repetitive ... and it may be, but fill it in for now.
  @Field(() => UserReference)
  public reportedBy: UserReference;

  @Field(() => [UserReference])
  public assignedTo: UserReference[];

  // We need to migrate this to a history entry, then remove it
  // All notes will be documented for several reasons...
  // Accountability, timing, status.
  @Field({ nullable: true })
  public notes?: string;

  // history her should be specific to the ChecklistItem or Service Interval to start
  // the user in this would be the person submitting the Inspection or Problem Report initially
  // For example, first note:
  // [message]: Created from [Inspection Title and ChecklistItem title | Service Interval Title and Milestone], [user] User Who Submitted
  //
  // Also, every time the user "Views" this work order, we add an entry here.
  // When a user Gets assigned, we add an entry here
  // When the status changes, we add an entry here
  // Etc.
  @Field(() => [WorkOrderHistoryItem], { defaultValue: [] })
  history: WorkOrderHistoryItem[];

  @Field(() => [String], { nullable: true, defaultValue: [] })
  public photos?: string[];

  @Field(() => WorkOrderStatusEnum)
  public status: WorkOrderStatusEnum;

  @Field(() => Float, { nullable: true, defaultValue: 0 })
  public meterValue: number;

  // this is the list of times that mechanic worked on this particular work item
  @Field(() => [WorkEntry])
  public workEntries: WorkEntry[];

  @Field(() => Int)
  public totalTimeInSeconds: number;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  assignedOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  completedOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  updatedOn?: Date;

  constructor(
    equipment: DetailedEquipmentReference,
    client: IdNameReference,
    reportedBy: UserReference,
    assignedTo: UserReference[],
    notes: string,
    status: WorkOrderStatusEnum,
    officeLocation: BasicOfficeLocationReference,
    job: JobReference,
    meterValue: number
  ) {
    this.equipment = equipment;
    this.client = client;
    this.reportedBy = reportedBy;
    this.assignedTo = assignedTo;
    this.notes = notes;
    this.status = status;
    this.officeLocation = officeLocation;
    this.job = job;
    this.meterValue = meterValue;
    this.workEntries = [];
    this.totalTimeInSeconds = 0;
  }
}
