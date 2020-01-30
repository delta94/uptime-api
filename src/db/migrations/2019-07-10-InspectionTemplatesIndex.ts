import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2019-07-10-InspectionTemplatesIndex',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.InspectionTemplates());
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-07-10-InspectionTemplatesIndex > down');
  },
};
