import { Context, CustomRequest } from '@/helpers/interfaces';
import { QueryStatistics, IDocumentSession } from 'ravendb';
import { Resolver, Query, Args, Arg, Ctx, Mutation } from 'type-graphql';
import { WorkOrder } from '@/types/workOrder/WorkOrder';
import { WorkOrderInput } from '@/types/workOrder/WorkOrderInput';
import { WorkOrderTableList } from '@/types/workOrder/WorkOrderTableList';
import { ProblemReportInput } from '@/types/workOrder/ProblemReportInput';
import { verifyAccess, Roles, formatSearchTerm, getNowUtc, enumAsString } from '@/helpers/utils';
import { RoleTypeEnum, NotificationSourceEnum, WorkOrderStatusEnum } from '@/types/Enums';
import { PrintArgs } from '@/types/PrintArgs';
import { UserReference } from '@/types/user/UserReference';
import { LogEntry } from '@/types/logEntry/LogEntry';
import { IdNameReference } from '@/types/common/IdNameReference';
import { WorkOrderStatusInput } from '@/types/workOrder/WorkOrderStatusInput';
import { Equipment } from '@/types/equipment/Equipment';
import { checkServiceInterval, saveNotificationWorkOrder } from '@/helpers/notificationsHelper';
import { TablePaginationWorkOrder } from '@/types/TablePaginationWorkOrder';
import { Notification } from '@/types/notifications/Notification';
import { DateTime } from 'luxon';
import { WorkOrderHistoryItem } from '@/types/workOrder/WorkOrderHistoryItem';
import { some, findIndex } from 'lodash';
import { addHistoryItem, startWorkEntry, stopWorkEntry } from '@/helpers/workOrders';
import { WorkOrderWorkItem } from '@/types/workOrder/WorkOrderWorkItem';
import { StopWorkEntryInput } from '@/types/workOrder/StopWorkEntryInput';
import { StartWorkEntryInput } from '@/types/workOrder/StartWorkEntryInput';
import moment = require('moment');
import { SaveChecklistItemNotesInput } from '@/types/inspection/SaveChecklistItemNotesInput';
import { SaveWorkItemNotesInput } from '@/types/workOrder/SaveWorkItemNotesInput';

@Resolver()
export class WorkOrderResolver {
  //#region Queries

  @Query(() => WorkOrderTableList)
  async workOrders(
    @Args() { skip, pageSize, searchText, completed, equipmentId }: TablePaginationWorkOrder,
    @Ctx() { session, req }: Context
  ): Promise<WorkOrderTableList> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    let stats: QueryStatistics;
    const query = session
      .query<WorkOrder>({ indexName: 'WorkOrders' })
      .statistics((s: QueryStatistics) => (stats = s))
      .orderByDescending('updatedOn')
      .skip(skip)
      .take(pageSize);

    if (completed) {
      query.whereEquals('status', WorkOrderStatusEnum.Completed);
    } else {
      query.not().whereEquals('status', WorkOrderStatusEnum.Completed);
    }

    if (equipmentId) {
      query.andAlso().whereEquals('equipmentId', equipmentId);
    }

    if (searchText) {
      query.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
      if (req.user.clientId) {
        query.andAlso().whereEquals('clientId', req.user.clientId);
      }
    } else if (req.user.clientId) {
      query.whereEquals('clientId', req.user.clientId);
    }

    // set ViewedOn needed for badge count
    const notifications = await session
      .query<Notification>({ indexName: 'Notifications' })
      .whereEquals('alertedUserId', req.user.id)
      .andAlso()
      .whereEquals('notificationSeen', false)
      .andAlso()
      .whereEquals('notificationSource', NotificationSourceEnum.WorkOrder)
      .all();
    // console.log(notifications);
    if (notifications.length > 0) {
      console.log('Setting viewedOn', notifications.length);
      notifications.forEach((notification: Notification) => {
        notification.viewedOn = DateTime.utc().toJSDate();
      });
      session.saveChanges();
    }

    return { workOrders: await query.all(), totalRows: stats.totalResults };
  }

  @Query(() => WorkOrderTableList)
  async workOrdersPrint(@Args() { selectedInspections: ids }: PrintArgs, @Ctx() { session, req }: Context): Promise<WorkOrderTableList> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    let stats: QueryStatistics;
    const q = session
      .query<WorkOrder>({ indexName: 'WorkOrders' })
      .whereIn('id', ids)
      .statistics((s: QueryStatistics) => (stats = s))
      .orderByDescending('updatedOn');

    if (req.user && req.user.clientId) {
      q.whereEquals('clientId', req.user.clientId);
    }

    return { workOrders: await q.all(), totalRows: stats.totalResults };
  }

  @Query(() => WorkOrder)
  async workOrderById(@Arg('id') id: string, @Ctx() { session, req }: Context): Promise<WorkOrder> {
    const wo = await session.load<WorkOrder>(id);
    // console.log('wo.assignedOn', wo.assignedOn);
    // console.log('typeof wo.assignedOn', typeof wo.assignedOn);
    // console.log('typeof wo.createdOn', typeof wo.createdOn);
    // console.log('JSON.stringify(wo,null,1)', JSON.stringify(wo, null, 1));
    await addHistoryItem(req, wo, 'Viewed', session);
    if (wo.workEntries.length > 10) {
      // limit to latest 10 entries
      wo.workEntries = wo.workEntries.slice(Math.max(wo.workEntries.length - 10, 0));
    }
    // console.log('wo', JSON.stringify(wo, null, 1));
    return wo;
  }

  //#endregion

  //#region Mutations

  @Mutation(() => WorkOrder)
  async saveWorkOrder(@Arg('data', () => WorkOrderInput) data: WorkOrderInput, @Ctx() { session, req }: Context): Promise<WorkOrder> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    try {
      await session.store(
        new LogEntry(
          'Resolvers > workOrders > saveWorkOrder',
          {
            data,
          },
          '[TRACE]',
          null,
          await IdNameReference.clientFromJwtUser(session, req.user),
          await UserReference.fromJwtUser(session, req.user)
        )
      );
    } catch (err) {
      console.log(err.message);
    }

    const entity = await WorkOrder.fromWorkOrderInput(session, data, req.user);
    await addHistoryItem(req, entity, 'Updated', session);

    await session.store<WorkOrder>(entity);
    await session.saveChanges();
    return entity;
  }

  @Mutation(() => WorkOrder)
  async saveWorkOrderStatus(@Arg('data', () => WorkOrderStatusInput) data: WorkOrderStatusInput, @Ctx() { session, req }: Context): Promise<WorkOrder> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    try {
      await session.store(
        new LogEntry(
          'Resolvers > workOrders > saveWorkOrderStatus',
          {
            data,
          },
          '[TRACE]',
          null,
          await IdNameReference.clientFromJwtUser(session, req.user),
          await UserReference.fromJwtUser(session, req.user)
        )
      );
    } catch (err) {
      console.log(err.message);
    }
    const entity = await WorkOrder.fromWorkOrderStatusInput(session, data);
    await addHistoryItem(req, entity, `Work Order Status changed to: ${data.status}`, session);
    await session.saveChanges();
    return entity;
  }

  @Mutation(() => WorkOrder)
  async startWorkOrder(@Arg('data', () => StartWorkEntryInput) data: StopWorkEntryInput, @Ctx() { session, req }: Context): Promise<WorkOrder> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    const entity = await WorkOrder.fromWorkEntryInput(session, data);
    const workEntry = await startWorkEntry(req, entity, data.status, session);

    await addHistoryItem(
      req,
      entity,
      `${workEntry.who.firstName} ${workEntry.who.lastName} Started [Status: ${enumAsString(data.status)}] at: ${DateTime.fromJSDate(workEntry.startedOn)
        .setZone(req.user.timezone)
        .toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS)}`,
      session
    );
    await session.saveChanges();
    return entity;
  }

  @Mutation(() => WorkOrder)
  async stopWorkOrder(@Arg('data', () => StopWorkEntryInput) data: StopWorkEntryInput, @Ctx() { session, req }: Context): Promise<WorkOrder> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    const entity = await WorkOrder.fromWorkEntryInput(session, data);
    const workEntry = await stopWorkEntry(req, entity, data, session);
    entity.totalTimeInSeconds = entity.workEntries.reduce((p, c) => (p += c.timeInSeconds), 0);

    await addHistoryItem(
      req,
      entity,
      `${workEntry.who.firstName} ${workEntry.who.lastName} Stopped [Status: ${enumAsString(data.status)}] at: ${DateTime.fromJSDate(workEntry.startedOn)
        .setZone(req.user.timezone)
        .toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS)}`,
      session
    );
    await session.saveChanges();
    return entity;
  }

  @Mutation(() => WorkOrder)
  async saveProblemReport(@Arg('data', () => ProblemReportInput) data: ProblemReportInput, @Ctx() { session, req }: Context): Promise<WorkOrder> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    try {
      await session.store(
        new LogEntry(
          'Resolvers > workOrders > saveProblemReport',
          {
            data,
          },
          '[TRACE]',
          null,
          await IdNameReference.clientFromJwtUser(session, req.user),
          await UserReference.fromJwtUser(session, req.user)
        )
      );
    } catch (err) {
      console.log(err.message);
    }

    const entity = await WorkOrder.fromProblemReportInput(session, data, req.user);
    entity.history = [new WorkOrderHistoryItem(`Created from Problem Report`, entity.reportedBy)];
    entity.workItems = [new WorkOrderWorkItem('Problem Report', entity.photos, data.notes)];

    entity.completedOn = getNowUtc();
    await session.store<WorkOrder>(entity);
    await session.saveChanges();

    await saveNotificationWorkOrder(
      await session.load<Equipment>(entity.equipment.id),
      entity,
      entity.client,
      NotificationSourceEnum.ProblemReport,
      session,
      req.hostname
    );

    if (entity.equipment) {
      const equipment = await session.load<Equipment>(entity.equipment.id);
      if (equipment.serviceInterval) {
        await checkServiceInterval(
          equipment,
          entity.client,
          equipment.serviceInterval.id,
          entity.meterValue,
          NotificationSourceEnum.ProblemReport,
          session,
          entity.reportedBy
        );
      }
    }

    return entity;
  }

  @Mutation(() => WorkOrder)
  async saveWorkOrderItemNotes(
    @Arg('data', () => SaveWorkItemNotesInput) { workOrderId, workItemId, notes }: SaveWorkItemNotesInput,
    @Ctx() { session, req }: Context
  ): Promise<WorkOrder> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    try {
      const workOrder = await session.load<WorkOrder>(workOrderId);
      if (workOrder) {
        const foundIndex = findIndex(workOrder.workItems, item => item.id === workItemId);
        workOrder.workItems[foundIndex].notes = notes;
      }
      await session.saveChanges();
      return workOrder;
    } catch (ex) {
      await session.store(
        new LogEntry(
          'Resolvers > InspectionResolver > Query > saveChecklistItemNotes',
          {
            workOrderId,
            workItemId,
            notes,
          },
          ex.message,
          new Error(ex.message).stack,
          await IdNameReference.clientFromJwtUser(session, req.user),
          await UserReference.fromJwtUser(session, req.user)
        )
      );
      await session.saveChanges();
      throw new Error('There was an error. Please try again.');
    }
  }

  //#endregion
}
