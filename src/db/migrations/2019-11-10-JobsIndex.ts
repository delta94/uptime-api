import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2019-11-10-JobsIndex',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.Jobs());
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-11-10-JobsIndex > down');
  },
};
