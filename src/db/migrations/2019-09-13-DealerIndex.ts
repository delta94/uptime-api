import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2019-09-13-DealerIndex',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.Dealers());
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-09-13-DealerIndex > down');
  },
};
