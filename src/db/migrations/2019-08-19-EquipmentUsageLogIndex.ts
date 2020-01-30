import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2019-08-19-EquipmentUsageLogIndex',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.EquipmentUsageLog());
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-08-19-EquipmentUsageLogIndex > down');
  },
};
