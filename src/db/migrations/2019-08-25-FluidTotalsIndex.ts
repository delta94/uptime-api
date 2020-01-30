import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2019-08-25-FluidTotalsIndex',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.FluidReports_Totals());
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-08-25-FluidTotalsIndex > down');
  },
};
