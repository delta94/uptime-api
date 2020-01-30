import { IDocumentStore } from 'ravendb';
import { v1 } from 'uuid';
import { User } from '../../schema/types/user/User';
import { Role } from '../../schema/types/role/Role';
import { UserRoleReference } from '../../schema/types/role/UserRoleReference';
import { generate } from 'shortid';
import { RoleTypeEnum } from '@/types/Enums';
import { Permission } from '@/types/role/Permission';

export default {
  name: '2019-08-20-RolesPatchManufacturer',
  up: async (store: IDocumentStore) => {
    const session = store.openSession();
    const adminRole = await session
      .query<Role>({ collection: 'Roles' })
      .whereEquals('name', 'Administrator')
      .andAlso()
      .whereEquals('type', 'Client')
      .firstOrNull();

    if (adminRole) {
      const perm: Permission = {
        id: generate(),
        privileges: ['View', 'Add', 'Edit', 'Delete'],
        name: 'Manufacturers',
        type: RoleTypeEnum.Client,
      };
      adminRole.permissions.push(perm);
      await session.saveChanges();
    }
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-08-20-RolesPatchManufacturer > down');
  },
};
