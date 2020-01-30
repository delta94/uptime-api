import { IDocumentStore } from 'ravendb';
import { Classifications } from '@/types/appSettings/Classifications';
import { Classification } from '@/types/appSettings/Classification';
import { getAppSettings } from '@/helpers/utils';

export default {
  name: '2019-11-03-SeedClassifications',
  up: async (store: IDocumentStore) => {
    const session = store.openSession();

    let appSettings = await getAppSettings<Classifications>(session, 'Classifications');
    console.log(JSON.stringify(appSettings, null, 2));
    if (!appSettings) {
      appSettings = { data: [] };
      appSettings.data.push({ name: 'Excavator' } as Classification);
      appSettings.data.push({ name: 'Crane' } as Classification);

      await session.store(appSettings, 'AppSettings/Classifications');
      console.log(JSON.stringify(appSettings, null, 2));
    }
    await session.saveChanges();
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-11-03-SeedClassifications > down');
  },
};
