import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2019-08-16-InspectionIndex',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.Inspections());
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-08-16-InspectionIndex > down');
  },
};
