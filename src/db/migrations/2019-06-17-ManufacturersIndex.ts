import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2019-06-17-ManufacturersIndex',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.Manufacturers());
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-06-17-ManufacturersIndex > down');
  },
};
