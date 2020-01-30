import { IDocumentStore } from 'ravendb';
import { v1 } from 'uuid';
import { User } from '../../schema/types/user/User';
import { Role } from '../../schema/types/role/Role';
import { UserRoleReference } from '../../schema/types/role/UserRoleReference';

export default {
  name: '2019-01-02-SeedAdminUsers',
  up: async (store: IDocumentStore) => {
    const session = store.openSession();
    const adminRole = await session
      .query<Role>({ collection: 'Roles' })
      .whereEquals('name', 'Administrator')
      .firstOrNull();

    if (adminRole) {
      const adminRoleReference = UserRoleReference.fromRole(adminRole);

      let user = new User(v1(), 'Troy', 'Zarger', 'troy@equipmentuptime.com', true, 'password', [adminRoleReference]);
      await session.store(user, 'users/1-A');

      user = new User(v1(), 'Steve', 'Portock', 'steve@equipmentuptime.com', true, 'password', [adminRoleReference]);
      await session.store(user, 'users/2-A');

      user = new User(v1(), 'Justin', 'Trentadue', 'justin@equipmentuptime.com', true, 'password', [adminRoleReference]);
      await session.store(user, 'users/3-A');

      await session.saveChanges();
    }
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-01-02-SeedAdminUsers > down');
  },
};
