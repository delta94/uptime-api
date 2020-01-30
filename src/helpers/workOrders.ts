import { some } from 'lodash';
import { CustomRequest } from './interfaces';
import { WorkOrder } from '@/types/workOrder/WorkOrder';
import { IDocumentSession } from 'ravendb';
import { RoleTypeEnum, WorkOrderStatusEnum } from '@/types/Enums';
import { WorkOrderHistoryItem } from '@/types/workOrder/WorkOrderHistoryItem';
import { UserReference } from '@/types/user/UserReference';
import { WorkEntry } from '@/types/workOrder/WorkEntry';
import { getNowUtc } from './utils';
import moment = require('moment');
import { User } from '@/types/user/User';
import { UserInputError } from 'apollo-server-express';
import { StopWorkEntryInput } from '@/types/workOrder/StopWorkEntryInput';
import { EquipmentPart } from '@/types/equipment/EquipmentPart';

export const addHistoryItem = async (req: CustomRequest, entity: WorkOrder, message: string, session: IDocumentSession) => {
  if (!some(req.user.roles, role => role.type === RoleTypeEnum.Corporate)) {
    if (!entity.history) {
      entity.history = [];
    }
    entity.history.push(new WorkOrderHistoryItem(message, await UserReference.fromJwtUser(session, req.user)));
    await session.saveChanges();
  }
};

// Will create new workEntry
export const startWorkEntry = async (req: CustomRequest, entity: WorkOrder, status: WorkOrderStatusEnum, session: IDocumentSession): Promise<WorkEntry> => {
  if (!entity.workEntries) {
    entity.workEntries = [];
  }
  const foundOpenEntry = entity.workEntries.find(x => x.startedOn !== null && !x.stoppedOn);
  if (foundOpenEntry) {
    throw new UserInputError('Work order already started!');
  }
  const who = await UserReference.fromJwtUser(session, req.user);
  const newWorkEntry = new WorkEntry(getNowUtc(), who);
  newWorkEntry.startStatus = status;
  entity.workEntries.push(newWorkEntry);
  entity.activeWorkEntryId = newWorkEntry.id;
  entity.status = status;
  await session.saveChanges();
  return newWorkEntry;
};

// will update existing workEntry req, entity, data, session
export const stopWorkEntry = async (req: CustomRequest, entity: WorkOrder, data: StopWorkEntryInput, session: IDocumentSession): Promise<WorkEntry> => {
  const who = await UserReference.fromJwtUser(session, req.user);
  const foundEntry = entity.workEntries.find(x => x.id === data.workEntryId && x.startedOn !== null && !x.stoppedOn);
  if (foundEntry) {
    foundEntry.stoppedOn = getNowUtc();
    foundEntry.timeInSeconds = moment(foundEntry.stoppedOn).diff(moment(foundEntry.startedOn), 'seconds');
    foundEntry.who = who;
    foundEntry.startStatus = data.status;
    // Updating work order
    entity.status = data.status;
    if (!entity.parts) entity.parts = [];
    if (data.partName || data.partNumber) {
      entity.parts.push({ name: data.partName, sku: data.partNumber, make: entity.equipment.make, model: entity.equipment.model } as EquipmentPart);
    }
    await session.saveChanges();
    return foundEntry;
  } else {
    throw new UserInputError('Please first start the work order!');
  }
};
