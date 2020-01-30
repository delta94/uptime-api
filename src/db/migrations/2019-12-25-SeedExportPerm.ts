import { IDocumentStore } from 'ravendb';
import { find } from 'lodash';
import { getAppSettings } from '@/helpers/utils';
import { RolePermissionsAppSettings } from '../../schema/types/appSettings/RolePermissionsAppSettings';
import { Role } from '../../schema/types/role/Role';
import { RolePermission } from '@/types/role/RolePermission';
import { User } from '@/types/user/User';
import { RoleTypeEnum } from '@/types/Enums';

// Will add the 'export' Priviligie to all client users so they can do a pdf export.
export default {
  name: '2019-12-25-SeedExportPerm',
  up: async (store: IDocumentStore) => {
    const session = store.openSession();

    const rolePermissions = await session
      .query<RolePermission>({ collection: 'RolePermissions' })
      .whereEquals('name', 'Work Orders')
      .all();

    console.log('Processing rolePermissions');
    const workOrderPrivileges = rolePermissions.find(x => x.name === 'Work Orders' && x.type === RoleTypeEnum.Client).privileges;
    if (workOrderPrivileges.findIndex(x => x === 'Export') === -1) {
      workOrderPrivileges.push('Export');
    }

    const workOrderPrivilegesCorp = rolePermissions.find(x => x.name === 'Work Orders' && x.type === RoleTypeEnum.Corporate).privileges;
    if (workOrderPrivilegesCorp.findIndex(x => x === 'Export') === -1) {
      workOrderPrivileges.push('Export');
    }

    await session.saveChanges();
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-12-25-SeedExportPerm > down');
  },
};
