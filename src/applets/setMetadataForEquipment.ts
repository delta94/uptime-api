import initializeStore from '../db';
import dotenv from 'dotenv';
import { Equipment } from '@/types/equipment/Equipment';

(async () => {
  try {
    dotenv.config();

    console.log('Started Transfer of Assets to Equipment');

    const store = await initializeStore();
    const session = store.openSession();
    try {
      const assets = await session.query<any>({ indexName: 'Equipment' }).all();

      for (const asset of assets) {
        if (asset.id.includes('Equipment')) {
          await session.delete(asset.id);
          await session.saveChanges();

          const e = await Equipment.fromAny(asset);
          await session.store<Equipment>(e, asset.id);
          const metadata = session.advanced.getMetadataFor(e);
          metadata['@collection'] = 'Equipment';
          console.log(asset.id, e.id, metadata['@collection']);
          await session.saveChanges();
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
