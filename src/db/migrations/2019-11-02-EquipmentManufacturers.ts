import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2019-11-03-EquipmentManufacturers',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.Equipment_Manufacturers());
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-11-03-EquipmentManufacturers > down');
  },
};
