import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2019-08-31-FluidReportsIndex',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.FluidReports());
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-08-31-FluidReportsIndex > down');
  },
};
