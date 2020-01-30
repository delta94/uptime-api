import { IDocumentStore, IndexQuery, PatchByQueryOperation } from 'ravendb';
import { Role } from '@/types/role/Role';

export default {
  name: '2019-08-21-PatchEquipmentExpectedUsage',
  up: async (store: IDocumentStore) => {
    const indexQuery = new IndexQuery();
    indexQuery.waitForNonStaleResults = true;

    indexQuery.query = `from index Equipment as equipment
    update {
      if (equipment.expectedUsage===undefined ){
        equipment.expectedUsage = { mon:8, tue:8, wed:8, thu:8, fri:8, sat:0, sun:0};
      }
      if (equipment.manufacturer){
        equipment.manufacturer = equipment.manufacturer.brand;
      }
    }`;

    const patch = new PatchByQueryOperation(indexQuery);
    const operation = await store.operations.send(patch);
    await operation.waitForCompletion();
  },
  down: async () => {
    console.log('2019-08-21-PatchEquipmentExpectedUsage > down');
  },
};
