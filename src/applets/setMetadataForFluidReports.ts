import initializeStore from '../db';
import dotenv from 'dotenv';
import { PutDocumentCommand } from 'ravendb';

(async () => {
  try {
    dotenv.config();

    console.log('ts-node -r tsconfig-paths/register src/applets/setMetadataForFluidReports.ts');
    console.log('Started Update of Metadata for FluidReports');

    const store = await initializeStore();
    const session = store.openSession();
    try {
      const fluidReports = await session.query<any>({ indexName: 'FluidReports' }).all();

      for (const fluidReport of fluidReports) {
        if (fluidReport.id.includes('FluidReport')) {
          const metadata = session.advanced.getMetadataFor(fluidReport);

          fluidReport['@metadata']['@nested-object-types'] = {
            ...metadata['@nested-object-types'],
            completedOn: 'date',
          };

          const putCommand = new PutDocumentCommand(fluidReport.id, null, fluidReport);
          await session.advanced.requestExecutor.execute(putCommand);
          console.log(fluidReport.completedOn, fluidReport.id); // , JSON.stringify(metadata, null, 1));
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
