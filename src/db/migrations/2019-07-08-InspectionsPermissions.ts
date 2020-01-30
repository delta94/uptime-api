import { IDocumentStore } from 'ravendb';
import { getAppSettings } from '@/helpers/utils';
import { RoleTypeEnum } from '../../schema/types/Enums';
import { RolePermissionsAppSettings } from '../../schema/types/appSettings/RolePermissionsAppSettings';
import { AvailablePermission } from '../../schema/types/role/AvailablePermission';

export default {
  name: '2019-07-08-InspectionsPermissions',
  up: async (store: IDocumentStore) => {
    const session = store.openSession();

    const appSettings = await getAppSettings<RolePermissionsAppSettings>(session, 'RolePermissions');
    const permName = 'Inspection History';
    if (appSettings) {
      const exist = appSettings.data.find(x => x.name === permName);

      if (!exist) {
        appSettings.data.push(new AvailablePermission('Inspection History', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']));
        appSettings.data.push(new AvailablePermission('Inspection History', RoleTypeEnum.Client, ['View', 'Add', 'Edit', 'Delete']));

        await session.store(appSettings, 'AppSettings/RolePermissions');
      } else {
        console.log('Already added');
      }
    }
    await session.saveChanges();
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-07-08-InspectionsPermissions > down');
  },
};
