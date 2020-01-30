import { IDocumentStore, IndexQuery, PatchByQueryOperation } from 'ravendb';

export default {
  name: '2019-01-12-PatchAdministratorRole',
  up: async (store: IDocumentStore) => {
    const indexQuery = new IndexQuery();
    indexQuery.waitForNonStaleResults = true;
    indexQuery.query = `from index Roles as roles
    where roles.name = "Administrator" and roles.type = "Application"
    update {
        roles.permissions.splice(3, 0, {
            name: 'Roles',
            privileges: ['Add', 'Edit', 'Delete'],
            id: 'acb15ebd-db84-4956-a478-7d3e3be5963a',
        })
    }
    `;
    const patch = new PatchByQueryOperation(indexQuery);
    const operation = await store.operations.send(patch);
    await operation.waitForCompletion();
  },
  down: async () => {
    console.log('2019-01-12-PatchAdministratorRole > down');
  },
};
