import initializeStore from '../db';
import dotenv from 'dotenv';
import { Equipment } from '@/types/equipment/Equipment';
import { Inspection } from '@/types/inspection/Inspection';
import { PatchOperation, PatchRequest, PutDocumentCommand } from 'ravendb';
import { DetailedEquipmentReference } from '@/types/equipment/DetailedEquipmentReference';
import { find } from 'lodash';
import { FluidReport } from '@/types/fluids/FluidReport';

(async () => {
  try {
    dotenv.config();

    console.log('Started Update of Fluid Reports and Metadata');

    const store = await initializeStore();
    const session = store.openSession();
    try {
      const fluidReports = await session.query<FluidReport>({ indexName: 'FluidReports' }).all();
      const equipment = await session.query<Equipment>({ collection: 'Equipment' }).all();
      console.log('equipment.length', equipment.length);

      // const inspection = await session.load<Inspection>('Inspections/5666-A');
      // inspections = [inspection];

      for (const fluidReport of fluidReports) {
        if (fluidReport.id.includes('FluidReports') && fluidReport.equipment) {
          // await session.delete(asset.id);
          // await session.saveChanges();
          const currentEquipment = find(equipment, e => e.id === fluidReport.equipment.id);
          if (currentEquipment) {
            console.log(fluidReport.updatedOn, fluidReport.equipment.id, currentEquipment.make);

            fluidReport.equipment = DetailedEquipmentReference.fromEquipment(currentEquipment);
            // const metadata = session.advanced.getMetadataFor(fluidReport);
            // fluidReport['@metadata']['@nested-object-types'] = {
            //   ...metadata['@nested-object-types'],
            //   equipment: 'DetailedEquipmentReference',
            //   client: 'IdNameReference',
            //   officeLocation: 'IdNameReference',
            //   job: 'JobReference',
            //   user: 'UserReference',
            // };
            // fluidReport['@metadata']['Raven-Node-Type'] = 'FluidReport';
            // const userCommand = new PutDocumentCommand(fluidReport.id, null, fluidReport);
            // await session.advanced.requestExecutor.execute(userCommand);
            // console.log(fluidReport.updatedOn, fluidReport.id, JSON.stringify(fluidReport['@metadata'], null, 1), JSON.stringify(fluidReport.equipment, null, 1)); // , JSON.stringify(metadata, null, 1));
            // console.log(JSON.stringify(fluidReport['@metadata'], null, 1)); // , JSON.stringify(metadata, null, 1));
            // console.log(JSON.stringify(fluidReport.equipment, null, 1)); // , JSON.stringify(metadata, null, 1));
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
