import { IDocumentStore } from 'ravendb';
import { getAppSettings } from '@/helpers/utils';
import { RoleTypeEnum } from '../../schema/types/Enums';
import { RolePermissionsAppSettings } from '../../schema/types/appSettings/RolePermissionsAppSettings';
import { AvailablePermission } from '../../schema/types/role/AvailablePermission';

export default {
  name: '2019-07-03-FluidReportPermissions',
  up: async (store: IDocumentStore) => {
    const session = store.openSession();

    const appSettings = await getAppSettings<RolePermissionsAppSettings>(session, 'RolePermissions'); // <IRolePermissionsAppSettings>(<unknown>await session.load<AppSettings>('AppSettings/RolePermissions'));
    console.log(JSON.stringify(appSettings, null, 2));
    if (appSettings) {
      appSettings.data.push(new AvailablePermission('Fluid Reports', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']));
      appSettings.data.push(new AvailablePermission('Fluid Reports', RoleTypeEnum.Client, ['View', 'Add', 'Edit', 'Delete']));

      await session.store(appSettings, 'AppSettings/RolePermissions');
      console.log(JSON.stringify(appSettings, null, 2));
    }
    await session.saveChanges();
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-07-03-FluidReportPermissions > down');
  },
};
