import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2019-09-13-DealerContactIndex',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.DealersContact());
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-09-13-DealerContactIndex > down');
  },
};
