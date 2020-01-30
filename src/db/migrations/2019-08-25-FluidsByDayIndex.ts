import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2019-08-25-FluidsByDayIndex',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.FluidReports_Day());
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-08-25-FluidsByDayIndex > down');
  },
};
