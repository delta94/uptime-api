import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2020-01-20-FluidReportsIndex',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.FluidReports());
  },
  down: async (store: IDocumentStore) => {
    console.log('2020-01-20-FluidReportsIndex > down');
  },
};
