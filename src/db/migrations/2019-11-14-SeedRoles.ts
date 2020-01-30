import { IDocumentStore } from 'ravendb';
import { filter, clone } from 'lodash';
import { getAppSettings } from '@/helpers/utils';
import { RoleTypeEnum, RoleScopeEnum } from '../../schema/types/Enums';
import { RolePermissionsAppSettings } from '../../schema/types/appSettings/RolePermissionsAppSettings';
import { AppSettings } from '../../schema/types/appSettings/AppSettings';
import { AvailablePermission } from '../../schema/types/role/AvailablePermission';
import { Permission } from '../../schema/types/role/Permission';
import { Role } from '../../schema/types/role/Role';

export default {
  name: '2019-11-14-SeedRoles',
  up: async (store: IDocumentStore) => {
    const session = store.openSession();

    let appSettings = await getAppSettings<RolePermissionsAppSettings>(session, 'RolePermissions'); // <IRolePermissionsAppSettings>(<unknown>await session.load<AppSettings>('AppSettings/RolePermissions'));
    if (!appSettings) {
      appSettings = new AppSettings([
        new AvailablePermission('Accounting', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Equipment', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Clients', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Dashboard', RoleTypeEnum.Corporate, ['View']),
        new AvailablePermission('Dealers', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Demo', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Developer', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Inspection History', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Inspection Templates', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Manufacturers', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Parts', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Jobs', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Office Locations', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Payment Plans', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Reports', RoleTypeEnum.Corporate, ['View', 'Export']),
        new AvailablePermission('Roles', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Service Intervals', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Users', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Work Orders', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']),

        new AvailablePermission('Developer', RoleTypeEnum.Developer, ['View']),

        new AvailablePermission('Manufacturers', RoleTypeEnum.Client, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Jobs', RoleTypeEnum.Client, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Office Locations', RoleTypeEnum.Client, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Accounting', RoleTypeEnum.Client, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Equipment', RoleTypeEnum.Client, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Dashboard', RoleTypeEnum.Client, ['View']),
        new AvailablePermission('Dealers', RoleTypeEnum.Client, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Inspection History', RoleTypeEnum.Client, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Inspection Templates', RoleTypeEnum.Client, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Manufacturers', RoleTypeEnum.Corporate, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Parts', RoleTypeEnum.Client, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Service Intervals', RoleTypeEnum.Client, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Users', RoleTypeEnum.Client, ['View', 'Add', 'Edit', 'Delete']),
        new AvailablePermission('Work Orders', RoleTypeEnum.Client, ['View', 'Add', 'Edit', 'Delete']),
      ]);
      await session.store(appSettings, 'AppSettings/RolePermissions');
    }
    await session.saveChanges();

    const getPermissions = (permissionList: string[], permissions: AvailablePermission[]): Permission[] => {
      const response: Permission[] = [];
      permissions.forEach(permission => {
        if (permissionList.indexOf(permission.name) >= 0) {
          response.push(Permission.fromAvailablePermission(clone(permission)));
        } else {
          response.push(Permission.fromAvailablePermission(clone(permission), []));
        }
      });
      return response;
    };

    const corporatePermissions = filter(appSettings.data, permission => permission.type === RoleTypeEnum.Corporate);
    const developerPermissions = filter(appSettings.data, permission => permission.type === RoleTypeEnum.Developer);
    const clientPermissions = filter(appSettings.data, permission => permission.type === RoleTypeEnum.Client);

    const corpAdmin = new Role('Administrator', RoleTypeEnum.Corporate, RoleScopeEnum.Global, corporatePermissions);
    await session.store(corpAdmin);

    const developer = new Role('Demo', RoleTypeEnum.Developer, RoleScopeEnum.Global, developerPermissions);
    await session.store(developer);

    const corpUserPermissions = ['Equipment', 'Jobs', 'Office Locations', 'Clients', 'Dashboard', 'Dealers', 'Reports', 'Users', 'Work Orders'];
    const corpUser = new Role('User', RoleTypeEnum.Corporate, RoleScopeEnum.Global, getPermissions(corpUserPermissions, corporatePermissions));
    await session.store(corpUser);

    let clientRolePermissions = [
      'Accounting',
      'Equipment',
      'Jobs',
      'Office Locations',
      'Dashboard',
      'Dealers',
      'Inspection History',
      'Inspection Templates',
      'Parts',
      'Service Intervals',
      'Users',
    ];
    const clientAdmin = new Role('Administrator', RoleTypeEnum.Client, RoleScopeEnum.Global, getPermissions(clientRolePermissions, clientPermissions));
    await session.store(clientAdmin);

    clientRolePermissions = [
      'Equipment',
      'Jobs',
      'Office Locations',
      'Dashboard',
      'Dealers',
      'Inspection History',
      'Parts',
      'Service Intervals',
      'Work Orders',
    ];
    const clientUser = new Role('User', RoleTypeEnum.Client, RoleScopeEnum.Global, getPermissions(clientRolePermissions, clientPermissions));
    await session.store(clientUser);

    clientRolePermissions = [
      'Equipment',
      'Jobs',
      'Office Locations',
      'Dashboard',
      'Dealers',
      'Inspection History',
      'Parts',
      'Service Intervals',
      'Work Orders',
    ];
    const clientMechanic = new Role('Mechanic', RoleTypeEnum.Client, RoleScopeEnum.Global, getPermissions(clientRolePermissions, clientPermissions));
    await session.store(clientMechanic);

    clientRolePermissions = ['Equipment', 'Jobs', 'Office Locations', 'Dashboard', 'Dealers', 'Inspection History'];
    const operator = new Role('Operator', RoleTypeEnum.Client, RoleScopeEnum.Global, getPermissions(clientRolePermissions, clientPermissions));
    await session.store(operator);

    await session.saveChanges();
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-11-14-SeedRoles > down');
  },
};
