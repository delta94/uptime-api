import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2019-08-05-WorkOrdersIndex',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.WorkOrders());
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-08-05-WorkOrdersIndex > down');
  },
};
