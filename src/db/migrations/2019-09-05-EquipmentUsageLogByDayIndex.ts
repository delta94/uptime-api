import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2019-09-05-EquipmentUsageLogByDayIndex',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.EquipmentUsageLogByDay());
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-09-05-EquipmentUsageLogByDayIndex > down');
  },
};
