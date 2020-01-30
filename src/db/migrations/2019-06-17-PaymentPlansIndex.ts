import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2019-05-10-PaymentPlansIndex',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.PaymentPlans());
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-05-10-PaymentPlansIndex > down');
  },
};
