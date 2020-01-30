import { IDocumentStore } from 'ravendb';
import { filter, clone, find } from 'lodash';
import { getAppSettings } from '@/helpers/utils';
import { RoleTypeEnum, RoleScopeEnum } from '../../schema/types/Enums';
import { RolePermissionsAppSettings } from '../../schema/types/appSettings/RolePermissionsAppSettings';
import { AppSettings } from '../../schema/types/appSettings/AppSettings';
import { AvailablePermission } from '../../schema/types/role/AvailablePermission';
import { Permission } from '../../schema/types/role/Permission';
import { Role } from '../../schema/types/role/Role';
import { RolePermission } from '@/types/role/RolePermission';
import { User } from '@/types/user/User';

export default {
  name: '2019-11-15-SeedRolePermissionsRolePermission',
  up: async (store: IDocumentStore) => {
    const session = store.openSession();
    const rolePermission = new RolePermission('Role Permissions', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete', 'Clone']);
    await session.store(rolePermission);
    await session.saveChanges();
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-11-15-SeedRolePermissionsRolePermission > down');
  },
};
