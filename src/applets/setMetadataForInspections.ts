import initializeStore from '../db';
import dotenv from 'dotenv';
import { Equipment } from '@/types/equipment/Equipment';
import { Inspection } from '@/types/inspection/Inspection';
import { PatchOperation, PatchRequest, PutDocumentCommand } from 'ravendb';

(async () => {
  try {
    dotenv.config();

    console.log('ts-node -r tsconfig-paths/register src/applets/setMetadataForInspections.ts');
    console.log('Started Update of Inspection Metadata');

    const store = await initializeStore();
    const session = store.openSession();
    try {
      const inspections = await session
        .query<any>({ indexName: 'Inspections' })
        .orderByDescending('createdOn')
        .all();

      // const inspection = await session.load<Inspection>('Inspections/5666-A');
      // inspections = [inspection];

      for (const inspection of inspections) {
        if (inspection.id.includes('Inspections')) {
          // await session.delete(asset.id);
          // await session.saveChanges();
          // console.log(inspection.updatedOn);

          const metadata = session.advanced.getMetadataFor(inspection);
          // metadata['@nested-object-types'] = {
          //   ...metadata['@nested-object-types'],
          //   updatedOn: 'date',
          // };
          if (!inspection['@metadata']['@nested-object-types'].completedOn) {
            inspection['@metadata']['@nested-object-types'] = {
              ...metadata['@nested-object-types'],
              completedOn: 'date',
            };
            const putCommand = new PutDocumentCommand(inspection.id, null, inspection);
            await session.advanced.requestExecutor.execute(putCommand);
            console.log(inspection.completedOn, inspection['@metadata']['@nested-object-types'].completedOn, inspection.id); // , JSON.stringify(metadata, null, 1));
          } else console.log('.');
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
