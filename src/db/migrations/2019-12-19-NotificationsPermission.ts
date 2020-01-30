import { IDocumentStore } from 'ravendb';
import { getAppSettings } from '@/helpers/utils';
import { RoleTypeEnum } from '../../schema/types/Enums';
import { RolePermissionsAppSettings } from '../../schema/types/appSettings/RolePermissionsAppSettings';
import { AvailablePermission } from '../../schema/types/role/AvailablePermission';
import { RolePermission } from '@/types/role/RolePermission';

export default {
  name: '2019-12-19-NotificationsPermission',
  up: async (store: IDocumentStore) => {
    const session = store.openSession();

    const rolePermissionCorp = new RolePermission('Notifications', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete', 'Clone']);
    await session.store(rolePermissionCorp);
    const rolePermissionClient = new RolePermission('Notifications', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete', 'Clone']);
    await session.store(rolePermissionClient);
    await session.saveChanges();
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-12-19-NotificationsPermission > down');
  },
};
