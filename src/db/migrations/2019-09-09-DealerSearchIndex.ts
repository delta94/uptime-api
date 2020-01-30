import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2019-09-09-DealerSearchIndex',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.DealersSearch());
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-09-09-DealerSearchIndex > down');
  },
};
