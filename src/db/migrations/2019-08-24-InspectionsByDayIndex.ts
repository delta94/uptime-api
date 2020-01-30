import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2019-08-24-InspectionsByDayIndex',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.InspectionsByDay());
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-08-24-InspectionsByDayIndex > down');
  },
};
