import initializeStore from '../db';
import dotenv from 'dotenv';
import { Equipment } from '@/types/equipment/Equipment';
import { Inspection } from '@/types/inspection/Inspection';
import { PatchOperation, PatchRequest, PutDocumentCommand } from 'ravendb';
import { DetailedEquipmentReference } from '@/types/equipment/DetailedEquipmentReference';
import { find } from 'lodash';

(async () => {
  try {
    dotenv.config();

    console.log('Started Update of Inspections and Metadata');

    const store = await initializeStore();
    const session = store.openSession();
    try {
      const inspections = await session.query<Inspection>({ indexName: 'Inspections' }).all();
      const equipment = await session.query<Equipment>({ collection: 'Equipment' }).all();
      console.log('equipment.length', equipment.length);

      // const inspection = await session.load<Inspection>('Inspections/5825-A');
      // inspections = [inspection];
      let count = 1;
      for (const inspection of inspections) {
        if (inspection.id.includes('Inspections') && inspection.equipment) {
          // await session.delete(asset.id);
          // await session.saveChanges();
          const currentEquipment = find(equipment, e => e.id === inspection.equipment.id);
          if (currentEquipment) {
            console.log(inspection.updatedOn, inspection.equipment.id, currentEquipment.make, count++);

            inspection.equipment = DetailedEquipmentReference.fromEquipment(currentEquipment);
            // const metadata = session.advanced.getMetadataFor(inspection);
            // inspection['@metadata']['@nested-object-types'] = {
            //   ...metadata['@nested-object-types'],
            //   equipment: 'DetailedEquipmentReference',
            //   // client: 'IdNameReference',
            //   // officeLocation: 'IdNameReference',
            //   // job: 'JobReference',
            //   // 'checklist[]': 'InspectionChecklistItem',
            //   // who: 'UserReference',
            //   // supervisor: 'UserReference',
            // };
            // workOrder['@metadata']['Raven-Node-Type'] = 'WorkOrder';
            // const userCommand = new PutDocumentCommand(inspection.id, null, inspection);
            // await session.advanced.requestExecutor.execute(userCommand);
            // console.log(fluidReport.updatedOn, fluidReport.id, JSON.stringify(fluidReport['@metadata'], null, 1), JSON.stringify(fluidReport.equipment, null, 1)); // , JSON.stringify(metadata, null, 1));
            // console.log(JSON.stringify(inspection['@metadata'], null, 1)); // , JSON.stringify(metadata, null, 1));
            // console.log(JSON.stringify(inspection.equipment, null, 1)); // , JSON.stringify(metadata, null, 1));
          } else {
            console.log('Skipping');
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
