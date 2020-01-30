import initializeStore from '../db';
import dotenv from 'dotenv';
import { Equipment } from '@/types/equipment/Equipment';
import { WorkOrder } from '@/types/workOrder/WorkOrder';
import { PutDocumentCommand } from 'ravendb';
import inspection from '@/types/inspection';
import e from 'express';

(async () => {
  try {
    dotenv.config();

    console.log('ts-node -r tsconfig-paths/register src/applets/setMetadataForWorkOrders.ts');
    console.log('Started Transfer of Assets to Equipment');

    const store = await initializeStore();
    const session = store.openSession();
    try {
      const workOrders = await session.query<any>({ indexName: 'WorkOrders' }).all();

      for (const workOrder of workOrders) {
        if (workOrder.id.includes('WorkOrder')) {
          const metadata = session.advanced.getMetadataFor(workOrder);

          workOrder['@metadata']['@nested-object-types'] = {
            ...metadata['@nested-object-types'],
            completedOn: 'date',
          };

          // console.log(`workOrder.id`, workOrder.id, workOrder['@metadata']['Raven-Node-Type']);
          // workOrder['@metadata']['Raven-Node-Type'] = 'WorkOrder';
          // console.log(JSON.stringify(workOrder['@metadata'], null, 1));

          const putCommand = new PutDocumentCommand(workOrder.id, null, workOrder);
          await session.advanced.requestExecutor.execute(putCommand);
          console.log(workOrder.completedOn, workOrder.id); // , JSON.stringify(metadata, null, 1));

          // await session.saveChanges();
        }
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
