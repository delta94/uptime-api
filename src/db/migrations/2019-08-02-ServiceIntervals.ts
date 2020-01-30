import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2019-08-02-ServiceIntervals',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.ServiceIntervals());
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-08-02-ServiceIntervals > down');
  },
};
