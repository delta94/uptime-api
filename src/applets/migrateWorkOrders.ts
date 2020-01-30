import initializeStore from '../db';
import dotenv from 'dotenv';
import { Equipment } from '@/types/equipment/Equipment';
import { Inspection } from '@/types/inspection/Inspection';
import { PatchOperation, PatchRequest, PutDocumentCommand } from 'ravendb';
import { DetailedEquipmentReference } from '@/types/equipment/DetailedEquipmentReference';
import { find, each } from 'lodash';
import { WorkOrder } from '@/types/workOrder/WorkOrder';
import { WorkOrderHistoryItem } from '@/types/workOrder/WorkOrderHistoryItem';
import { WorkDocs } from 'aws-sdk/clients/all';
import { WorkOrderWorkItem } from '@/types/workOrder/WorkOrderWorkItem';
import { IdTitleReference } from '@/types/common/IdTitleReference';

(async () => {
  try {
    dotenv.config();

    console.log('ts-node -r tsconfig-paths/register src/applets/migrateWorkOrders.ts');
    console.log('Started Update of WorkOrder Migration');

    const store = await initializeStore();
    const session = store.openSession();
    try {
      const workOrders = await session
        .query<any>({ collection: 'WorkOrders' })
        .orderBy('createdOn')
        .all();

      for (const workOrder of workOrders) {
        // if (workOrder.workItems) {
        //   for (const workItem of workOrder.workItems) {
        //     if (!workItem.notes) {
        //       if (workItem.history && workItem.history.length === 2) {
        //         workItem.notes = workItem.history[1].message;
        //       } else {
        //         console.log('No History or 1', workItem.history ? workItem.history.length : 'null', workOrder.id);
        //       }
        //     } else {
        //       console.log('Has Notes', workOrder.id);
        //     }
        //   }
        // } else {
        //   console.log('!workOrder.workItems', JSON.stringify(workOrder, null, 1));
        // }

        // if (!workOrder.history || workOrder.history.length === 0) {
        //   workOrder.history = [];
        //   workOrder.history.push(new WorkOrderHistoryItem(`Created from ${workOrder.inspection ? 'PM' : 'Problem Report'}`, workOrder.reportedBy));
        // }

        // if (!workOrder.workItems || workOrder.workItems.length === 0) {
        //   workOrder.workItems = [];
        //   const historyItems = [];
        //   if (workOrder.inspection) {
        //     historyItems.push(new WorkOrderHistoryItem(`Created by Checklist Item: ${workOrder.inspection.title}`, workOrder.reportedBy));
        //   } else {
        //     historyItems.push(new WorkOrderHistoryItem(`Created by Problem Report.`, workOrder.reportedBy));
        //   }
        //   const workItem = new WorkOrderWorkItem('Work Item', [
        //     ...historyItems,
        //     new WorkOrderHistoryItem(workOrder.notes && workOrder.notes !== '' ? workOrder.notes : 'None Supplied.', workOrder.reportedBy),
        //   ]);
        //   workItem.photos = workOrder.photos;
        //   workOrder.workItems.push(workItem);
        // }

        // if (workOrder.inspection) {
        //   if (!workOrder.inspection.inspectionChecklists) {
        //     workOrder.inspection.inspectionChecklists = [];
        //     workOrder.inspection.inspectionChecklists.push(new IdTitleReference(workOrder.inspection.inspectionChecklistId, workOrder.inspection.title));
        //   }
        // }

        // each(workOrder.history, history => (history.enteredOn = workOrder.createdOn));
        // each(workOrder.workItems, wi => each(wi.history, h => (h.enteredOn = workOrder.createdOn)));
        // console.log('workOrder.id', workOrder.id);
        // await session.saveChanges();

        // const currentEquipment = find(equipment, e => e.id === workOrder.equipment.id);
        // if (currentEquipment) {
        //   console.log(workOrder.updatedOn, workOrder.equipment.id, currentEquipment.make, count++);

        //   workOrder.equipment = DetailedEquipmentReference.fromEquipment(currentEquipment);

        const metadata = session.advanced.getMetadataFor(workOrder);
        workOrder['@metadata']['@nested-object-types'] = {
          ...metadata['@nested-object-types'],
          assignedOn: 'date',
        };
        // workOrder['@metadata']['Raven-Node-Type'] = 'WorkOrder';
        const userCommand = new PutDocumentCommand(workOrder.id, null, workOrder);
        await session.advanced.requestExecutor.execute(userCommand);
        console.log('workOrder.id', workOrder.id);
        // console.log('workOrder.id', workOrder.id, workOrder.workItems.reduce((p, c) => p.concat([c.notes]), new Array<string>()).join(', '));
      }

      process.exit(1);
    } catch (ex) {
      console.log(ex.message);
      process.exit(1);
    }
  } catch (ex) {
    console.log(ex.message);
    process.exit(1);
  }
})();
