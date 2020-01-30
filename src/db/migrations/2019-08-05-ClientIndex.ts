import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2019-08-05-ClientIndex',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.Clients());
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-08-05-ClientIndex > down');
  },
};
