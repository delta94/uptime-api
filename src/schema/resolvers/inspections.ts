import { Context } from '@/helpers/interfaces';
import { Roles, verifyAccess, formatSearchTerm, getEstimateUsageForDay, getNowUtc } from '@/helpers/utils';
import { QueryStatistics, GroupByField, WhereParams } from 'ravendb';
import { Resolver, Query, Args, Arg, Ctx, Mutation } from 'type-graphql';
import { TablePaginationWithSearchTextArgs } from '@/types/TablePaginationWithSearchTextArgs';
import { InspectionTableList } from '@/types/inspection/InspectionTableList';
import { InspectionInput } from '@/types/inspection/InspectionInput';
import { Inspection } from '@/types/inspection/Inspection';
import { User } from '@/types/user/User';
import { UserReference } from '@/types/user/UserReference';
import { RoleTypeEnum, ChecklistItemTypeEnum, WorkOrderStatusEnum, NotificationSourceEnum } from '@/types/Enums';
import { Equipment } from '@/types/equipment/Equipment';
import { GetNewInspectionArgs } from '@/types/inspection/GetNewInspectionArgs';
import { InspectionTemplate } from '@/types/inspectionTemplate/InspectionTemplate';
import { generate } from 'shortid';
import { find, findIndex, orderBy, maxBy } from 'lodash';
import { InspectionChecklistItem } from '@/types/inspection/InspectionChecklistItem';
import { SaveChecklistItemInput } from '@/types/inspection/SaveChecklistItemInput';
import { SaveChecklistItemNotesInput } from '@/types/inspection/SaveChecklistItemNotesInput';
import { LogEntry } from '@/types/logEntry/LogEntry';
import { DateTime } from 'luxon';
import { InspectionEquipmentTableList } from '@/types/inspection/InspectionEquipmentTableList';
import { ResponseChartInspection } from '@/types/inspection/charts/ResponseChartInspection';
import { InspectionChart } from '@/types/inspection/charts/InspectionChart';
import { ResponseChartInspectionByDay } from '@/types/inspection/charts/ResponseChartInspectionByDay';
import { InspectionChartArgs } from '@/types/inspection/charts/InspectionChartArgs';
import { InspectionByDay } from '@/types/inspection/charts/InspectionByDay';
import { EquipmentUsageLog } from '@/types/equipmentUsageLog/EquipmentUsageLog';
import { PrintArgs } from '@/types/PrintArgs';
import { DetailedEquipmentReference } from '@/types/equipment/DetailedEquipmentReference';
import { IdNameReference } from '@/types/common/IdNameReference';
import { WorkOrder } from '@/types/workOrder/WorkOrder';
import { FluidReport } from '@/types/fluids/FluidReport';
import { InspectionTemplateReference } from '@/types/inspectionTemplate/InspectionTemplateReference';
import { InspectionReference } from '@/types/inspection/InspectionReference';
import { ChecklistItemStatus } from '@/types/inspectionTemplate/ChecklistItemStatus';
import { checkServiceInterval, saveNotificationWorkOrder } from '@/helpers/notificationsHelper';
import { WorkOrderWorkItem } from '@/types/workOrder/WorkOrderWorkItem';
import { WorkOrderHistoryItem } from '@/types/workOrder/WorkOrderHistoryItem';
import { IdTitleReference } from '@/types/common/IdTitleReference';
import { InspectionNotificationReference } from '@/types/inspection/InspectionNotificationReference';

@Resolver()
export class InspectionResolver {
  //#region Queries

  @Query(() => InspectionTableList)
  async inspections(@Args() { skip, pageSize, searchText }: TablePaginationWithSearchTextArgs, @Ctx() { session, req }: Context): Promise<InspectionTableList> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    try {
      let stats: QueryStatistics;
      const inspectionQuery = session
        .query<Inspection>({ indexName: 'Inspections' })
        .statistics((s: QueryStatistics) => (stats = s))
        .whereEquals('completed', true)
        .orderByDescending('updatedOn')
        .skip(skip)
        .take(pageSize);

      if (searchText) {
        inspectionQuery.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
        if (req.user && req.user.clientId) {
          inspectionQuery.andAlso().whereEquals('clientId', req.user.clientId);
        }
      } else if (req.user && req.user.clientId) {
        inspectionQuery.whereEquals('clientId', req.user.clientId);
      }

      return { inspections: await inspectionQuery.all(), totalRows: stats.totalResults };
    } catch (ex) {
      await session.store(
        new LogEntry(
          'Resolvers > InspectionResolver > Query > inspections',
          {
            skip,
            pageSize,
            searchText,
          },
          ex.message,
          new Error(ex.message).stack,
          await IdNameReference.clientFromJwtUser(session, req.user),
          await UserReference.fromJwtUser(session, req.user)
        )
      );
      await session.saveChanges();
    }
  }

  @Query(() => InspectionTableList)
  async inspectionsPrint(@Args() { selectedInspections: ids }: PrintArgs, @Ctx() { session, req }: Context): Promise<InspectionTableList> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    try {
      let stats: QueryStatistics;
      const inspectionQuery = session
        .query<Inspection>({ indexName: 'Inspections' })
        .whereIn('id', ids)
        .statistics((s: QueryStatistics) => (stats = s))
        .orderByDescending('updatedOn');

      if (req.user && req.user.clientId) {
        inspectionQuery.whereEquals('clientId', req.user.clientId);
      }

      return { inspections: await inspectionQuery.all(), totalRows: stats.totalResults };
    } catch (ex) {
      await session.store(
        new LogEntry(
          'Resolvers > InspectionPrintResolver > Query > inspections',
          {},
          ex.message,
          new Error(ex.message).stack,
          await IdNameReference.clientFromJwtUser(session, req.user),
          await UserReference.fromJwtUser(session, req.user)
        )
      );
      await session.saveChanges();
    }
  }

  @Query(() => ResponseChartInspection)
  async chartInspection(@Ctx() { session, req }: Context): Promise<ResponseChartInspection> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    const chartData = await session
      .query({ collection: 'Inspections' })
      .whereEquals('clientId', req.user.clientId)
      .groupBy('client.id', 'who.id', 'who.firstName', 'who.lastName')
      .selectKey('client.id', 'clientId')
      .selectKey('who.id', 'id')
      .selectKey('who.firstName', 'firstName')
      .selectKey('who.lastName', 'lastName')
      .selectCount('total')
      .ofType(InspectionChart)
      .all();
    // console.log(chartData);

    return {
      chartData: chartData as InspectionChart[],
    };
  }

  @Query(() => ResponseChartInspection)
  async chartInspectionByDay(@Args() { equipmentId }: InspectionChartArgs, @Ctx() { session, req }: Context): Promise<ResponseChartInspectionByDay> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    const q = session
      .query<InspectionByDay>({ indexName: 'InspectionsByDay' })
      .whereEquals('clientId', req.user.clientId)
      .whereEquals('type', 'Post-Shift');

    const inspectionByDay = await q.all();

    // console.log(inspectionByDay);

    return {
      chartData: inspectionByDay,
    };
  }

  @Query(() => InspectionEquipmentTableList)
  async inspectionsForEquipment(
    @Args() { skip, pageSize, searchText, id }: TablePaginationWithSearchTextArgs,
    @Ctx() { session, req }: Context
  ): Promise<InspectionEquipmentTableList> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    try {
      let stats: QueryStatistics;
      const inspectionQuery = session
        .query<Inspection>({ indexName: 'Inspections' })
        .statistics((s: QueryStatistics) => (stats = s))
        .whereEquals('equipmentId', id)
        .orderByDescending('updatedOn')
        .skip(skip)
        .take(pageSize);

      if (searchText) {
        inspectionQuery.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
        if (req.user && req.user.clientId) {
          inspectionQuery.andAlso().whereEquals('clientId', req.user.clientId);
        }
      } else if (req.user && req.user.clientId) {
        inspectionQuery.whereEquals('clientId', req.user.clientId);
      }

      return { inspectionsForEquipment: await inspectionQuery.all(), totalRows: stats.totalResults };
    } catch (ex) {
      await session.store(
        new LogEntry(
          'Resolvers > InspectionResolver > Query > inspections',
          {
            skip,
            pageSize,
            searchText,
          },
          ex.message,
          new Error(ex.message).stack,
          await IdNameReference.clientFromJwtUser(session, req.user),
          await UserReference.fromJwtUser(session, req.user)
        )
      );
      await session.saveChanges();
    }
  }

  @Query(() => Inspection)
  async inspectionById(@Arg('id') id: string, @Ctx() { session, req }: Context): Promise<Inspection> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    ]);

    // Setting id for old checklist items so save note would work
    const insp = await session.load<Inspection>(id);
    insp.checklist.forEach(item => {
      if (!item.id) {
        item.id = generate();
        // console.log('Adding id');
      }
    });
    session.saveChanges();
    return insp;
  }

  @Query(() => Inspection)
  async getNewInspection(@Args() { equipmentId }: GetNewInspectionArgs, @Ctx() { session, req }: Context): Promise<Inspection> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    try {
      const equipment = await session.load<Equipment>(equipmentId);
      const inspectionTemplate = await session.load<InspectionTemplate>(equipment.inspectionTemplate.id);

      let inspection = await session
        .query<Inspection>({ indexName: 'Inspections' })
        .whereEquals('completed', false)
        .andAlso()
        .whereEquals('whoId', req.user.id)
        .andAlso()
        .whereEquals('equipmentId', equipmentId)
        .orderByDescending('createdOn')
        .firstOrNull();

      if (!inspection) {
        inspection = new Inspection(0, DetailedEquipmentReference.fromEquipment(equipment), 'Pre-Shift', []);
        inspection.inspectionTemplate = InspectionTemplateReference.fromInspectionTemplate(inspectionTemplate);
        inspection.completed = false;
        inspection.completedOn = getNowUtc();
        inspection.checklist = inspectionTemplate.checklist.map<InspectionChecklistItem>(checklistItem => {
          const item = new InspectionChecklistItem();
          item.id = checklistItem.id;
          item.consumable = checklistItem.consumable;
          item.notes = '';
          item.photos = [];
          item.status = checklistItem.type === ChecklistItemTypeEnum.Status ? find(checklistItem.statuses, status => status.isDefault).text : '';
          item.title = checklistItem.title;
          item.type = checklistItem.type;
          item.completed = false;
          return item;
        });

        const user = await session.load<User>(req.user.id);
        inspection.who = new UserReference(user.id, user.firstName, user.lastName, user.email);

        if (user.supervisor) {
          inspection.supervisor = user.supervisor;
        }

        if (user.client) {
          inspection.client = user.client;
        }
      } else {
        inspection.equipment = DetailedEquipmentReference.fromEquipment(equipment);
      }

      await session.store(inspection);
      await session.saveChanges();
      return inspection;
    } catch (ex) {
      await session.store(
        new LogEntry(
          'Resolvers > InspectionResolver > Query > getNewInspection',
          {
            equipmentId,
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

  //#region Mutations

  @Mutation(() => Inspection)
  async saveInspection(@Arg('data', () => InspectionInput) data: InspectionInput, @Ctx() { session, req }: Context): Promise<Inspection> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    try {
      const entity = await Inspection.fromInspectionInput(session, data, req.user);
      entity.completed = true;
      entity.completedOn = getNowUtc();
      if (!entity.who) {
        const who = await session.load<User>(req.user.id);
        entity.who = UserReference.fromUser(who);
        entity.supervisor = who.supervisor;
        entity.client = who.client;
      }
      await session.store<Inspection>(entity);
      
      const equipment = await session.load<Equipment>(entity.equipment.id);
      console.log('Equipment is ', equipment.id);
      const newMeterValue = entity.meterValue;
      if (equipment.serviceInterval) {
        console.log('Checking service interval')
        await checkServiceInterval(
          equipment,
          entity.client,
          equipment.serviceInterval.id,
          newMeterValue,
          NotificationSourceEnum.Inspection,
          session,
          entity.who
        );
      }

      if (equipment) {
        console.log('Save inspection 2')
          console.log(equipment);
        if (entity.inspectionTemplate && entity.inspectionTemplate.id) {
          

          const template = await session.load<InspectionTemplate>(entity.inspectionTemplate.id);
          if (template) {
            console.log('region create work order from: Inspection');
            //#region create work order from: Inspection
            const inspectionChecklists: IdTitleReference[] = [];
            const workItems: WorkOrderWorkItem[] = [];
            const notes: string[] = [];

            for (const item of entity.checklist) {
              const checklistItem = find(template.checklist, cl => cl.id === item.id);
              const status = find<ChecklistItemStatus>(checklistItem.statuses, s => s.text === item.status);

              // work order checks
              if (item.shouldSendAlert || (status && status.shouldSendAlert)) {
                try {
                  inspectionChecklists.push(new IdTitleReference(item.id, item.title));
                  workItems.push(new WorkOrderWorkItem(item.title, item.photos, item.notes));
                  notes.push(item.notes);
                } catch (ex) {
                  await session.store(
                    new LogEntry(
                      'Resolvers > InspectionResolver > Mutation > saveInspection > Work Order Exception',
                      {
                        workItems,
                        inspectionChecklists,
                        item,
                        checklistItem,
                        status,
                      },
                      ex.message,
                      new Error(ex.message).stack,
                      await IdNameReference.clientFromJwtUser(session, req.user),
                      await UserReference.fromJwtUser(session, req.user)
                    )
                  );
                  await session.saveChanges();
                }
              }

              //#endregion

              // fluid report checks
              if (item.consumable && item.consumableAmount) {
                if (checklistItem) {
                  let fluidReport: FluidReport = null;
                  try {
                    // create fluid report
                    fluidReport = new FluidReport(
                      entity.equipment,
                      checklistItem.consumableFluid,
                      item.consumableUnitOfMeasure,
                      item.consumableAmount,
                      entity.meterValue
                    );
                    fluidReport.client = entity.client;
                    fluidReport.officeLocation = equipment.officeLocation;
                    fluidReport.job = equipment.job;
                    fluidReport.user = entity.who;
                    fluidReport.inspection = new InspectionReference(entity.id, item.id, item.title);
                    fluidReport.completedOn = getNowUtc();
                    fluidReport.createdOn = getNowUtc();
                    fluidReport.updatedOn = getNowUtc();

                    await session.store(fluidReport);
                    await session.saveChanges();
                  } catch (ex) {
                    await session.store(
                      new LogEntry(
                        'Resolvers > InspectionResolver > Mutation > saveInspection > Fluid Report Exception',
                        {
                          fluidReport,
                          item,
                          checklistItem,
                          status,
                        },
                        ex.message,
                        new Error(ex.message).stack,
                        await IdNameReference.clientFromJwtUser(session, req.user),
                        await UserReference.fromJwtUser(session, req.user)
                      )
                    );
                    await session.saveChanges();
                  }
                }
              }
            }

            if (workItems.length) {
              const workOrder = new WorkOrder(
                entity.equipment,
                entity.client,
                entity.who,
                equipment.mechanics,
                notes.join('; '),
                WorkOrderStatusEnum.Open,
                entity.officeLocation,
                entity.job,
                entity.meterValue
              );
              workOrder.workItems = workItems;
              workOrder.history = [new WorkOrderHistoryItem(`Created from Preventative Maintenance`, entity.who)];
              workOrder.inspection = new InspectionNotificationReference(entity.id, inspectionChecklists, entity.inspectionTemplate.title); // what should title be ?
              workOrder.createdOn = getNowUtc();
              workOrder.updatedOn = getNowUtc();
              workOrder.completedOn = getNowUtc();
              await session.store(workOrder);
              await session.saveChanges();
              await saveNotificationWorkOrder(equipment, workOrder, entity.client, NotificationSourceEnum.Inspection, session, req.hostname);
            }
          }
        }
      }

      // Insert new Usage Log entry
      if (entity.type === 'Pre-Shift') {
        const equipmentUsageLog = EquipmentUsageLog.fromData(
          entity.who,
          entity.equipment,
          entity.client,
          getEstimateUsageForDay(equipment),
          entity.meterValue,
          'Pre-Shift'
        );
        // console.log('Storing');
        // console.log(equipmentUsageLog);
        await session.store<EquipmentUsageLog>(equipmentUsageLog);
      } else if (entity.type === 'Post-Shift') {
        // Find the Pre-Shift and update it
        const usage = await session
          .query<EquipmentUsageLog>({ indexName: 'EquipmentUsageLog' })
          .whereEquals('clientId', entity.client.id)
          .andAlso()
          .whereEquals('equipmentId', entity.equipment.id)
          .andAlso()
          .whereEquals('whoId', entity.who.id)
          .andAlso()
          .whereEquals('type', 'Pre-Shift')
          .orderByDescending('updatedOn')
          .firstOrNull();
        if (usage) {
          usage.meterValueOut = entity.meterValue;
          usage.actualUsage = usage.meterValueOut - usage.meterValueIn;
          if (!equipment.meterValue) equipment.meterValue = 0;
          equipment.meterValue = equipment.meterValue + usage.actualUsage; // total meter value
          usage.type = 'Post-Shift';
          usage.updatedOn = DateTime.utc().toJSDate();

          // console.log('Updating');
          // console.log(usage);
        } else {
          throw new Error('Please first enter Pre-Shift values');
        }
      }
      await session.saveChanges();
      return entity;
    } catch (ex) {
      // console.log(ex);
      await session.store(
        new LogEntry(
          'Resolvers > InspectionResolver > Mutation > saveInspection',
          {
            args: data,
          },
          ex.message,
          new Error(ex.message).stack,
          await IdNameReference.clientFromJwtUser(session, req.user),
          await UserReference.fromJwtUser(session, req.user)
        )
      );
      await session.saveChanges();
      throw ex.message;
    }
  }

  @Mutation(() => Inspection)
  async saveChecklistItem(
    @Arg('data', () => SaveChecklistItemInput) { inspectionId, checklist }: SaveChecklistItemInput,
    @Ctx() { session, req }: Context
  ): Promise<Inspection> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    try {
      const inspection = await session.load<Inspection>(inspectionId);
      if (inspection) {
        const checklistItemIndex = findIndex(inspection.checklist, item => item.id === checklist.id);
        inspection.checklist[checklistItemIndex] = { ...checklist, completed: true };
      }
      await session.saveChanges();
      return inspection;
    } catch (ex) {
      await session.store(
        new LogEntry(
          'Resolvers > InspectionResolver > Query > saveChecklistItem',
          {
            inspectionId,
            checklist,
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

  @Mutation(() => Inspection)
  async saveChecklistItemNotes(
    @Arg('data', () => SaveChecklistItemNotesInput) { inspectionId, checklistItemId, notes }: SaveChecklistItemNotesInput,
    @Ctx() { session, req }: Context
  ): Promise<Inspection> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    try {
      const inspection = await session.load<Inspection>(inspectionId);
      if (inspection) {
        const checklistItemIndex = findIndex(inspection.checklist, item => item.id === checklistItemId);
        inspection.checklist[checklistItemIndex].notes = notes;
      }
      await session.saveChanges();
      return inspection;
    } catch (ex) {
      await session.store(
        new LogEntry(
          'Resolvers > InspectionResolver > Query > saveChecklistItemNotes',
          {
            inspectionId,
            checklistItemId,
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
