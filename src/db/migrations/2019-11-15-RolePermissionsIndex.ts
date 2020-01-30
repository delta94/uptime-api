import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2019-11-15-RolePermissionsIndex',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.RolePermissions());
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-11-15-RolePermissionsIndex > down');
  },
};
