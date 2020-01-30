import initializeStore from '../db';
import dotenv from 'dotenv';
import { Equipment } from '@/types/equipment/Equipment';
import { Inspection } from '@/types/inspection/Inspection';
import { PatchOperation, PatchRequest, PutDocumentCommand } from 'ravendb';
import { DetailedEquipmentReference } from '@/types/equipment/DetailedEquipmentReference';
import { find } from 'lodash';
import { WorkOrder } from '@/types/workOrder/WorkOrder';

(async () => {
  try {
    dotenv.config();

    console.log('Started Update of Fluid Reports and Metadata');

    const store = await initializeStore();
    const session = store.openSession();
    try {
      const workOrders = await session.query<WorkOrder>({ indexName: 'WorkOrders' }).all();
      const equipment = await session.query<Equipment>({ collection: 'Equipment' }).all();
      console.log('equipment.length', equipment.length);

      // const inspection = await session.load<Inspection>('Inspections/5666-A');
      // inspections = [inspection];

      let count = 1;
      for (const workOrder of workOrders) {
        if (workOrder.id.includes('WorkOrders') && workOrder.equipment) {
          // await session.delete(asset.id);
          // await session.saveChanges();
          const currentEquipment = find(equipment, e => e.id === workOrder.equipment.id);
          if (currentEquipment) {
            console.log(workOrder.updatedOn, workOrder.equipment.id, currentEquipment.make, count++);

            workOrder.equipment = DetailedEquipmentReference.fromEquipment(currentEquipment);
            // const metadata = session.advanced.getMetadataFor(workOrder);
            // workOrder['@metadata']['@nested-object-types'] = {
            //   ...metadata['@nested-object-types'],
            //   equipment: 'DetailedEquipmentReference',
            //   client: 'IdNameReference',
            //   officeLocation: 'IdNameReference',
            //   job: 'JobReference',
            //   user: 'UserReference',
            // };
            // workOrder['@metadata']['Raven-Node-Type'] = 'WorkOrder';
            // const userCommand = new PutDocumentCommand(workOrder.id, null, workOrder);
            // await session.advanced.requestExecutor.execute(userCommand);
            // console.log(fluidReport.updatedOn, fluidReport.id, JSON.stringify(fluidReport['@metadata'], null, 1), JSON.stringify(fluidReport.equipment, null, 1)); // , JSON.stringify(metadata, null, 1));
            // console.log(JSON.stringify(workOrder['@metadata'], null, 1)); // , JSON.stringify(metadata, null, 1));
            // console.log(JSON.stringify(workOrder.equipment, null, 1)); // , JSON.stringify(metadata, null, 1));
          }
        }
      }

      await session.saveChanges();
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
