import { IDocumentStore, IndexQuery, PatchByQueryOperation } from 'ravendb';
import { Role } from '@/types/role/Role';

export default {
  name: '2019-01-12-PatchUsersAdministratorRole',
  up: async (store: IDocumentStore) => {
    const session = store.openSession();

    const adminRole = await session.load<Role>('roles/1-A');
    const indexQuery = new IndexQuery();
    indexQuery.waitForNonStaleResults = true;
    indexQuery.query = `from index Users as users
    update {
        const index = users.roles.forEach(role => {
            if( role.name == "Administrator") {
                role.permissions.splice(3, 0, {
                  name: 'Roles',
                  privileges: ['Add', 'Edit', 'Delete'],
                  id: 'acb15ebd-db84-4956-a478-7d3e3be5963a',
                })
            }
        })
    }`;
    const patch = new PatchByQueryOperation(indexQuery);
    const operation = await store.operations.send(patch);
    await operation.waitForCompletion();
  },
  down: async () => {
    console.log('2019-01-12-PatchUsersAdministratorRole > down');
  },
};
