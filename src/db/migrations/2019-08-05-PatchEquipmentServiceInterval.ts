import { IDocumentStore, IndexQuery, PatchByQueryOperation } from 'ravendb';
import { Role } from '@/types/role/Role';

export default {
  name: '2019-08-05-PatchEquipmentServiceInterval',
  up: async (store: IDocumentStore) => {
    const indexQuery = new IndexQuery();
    indexQuery.waitForNonStaleResults = true;

    indexQuery.query = `from index Equipment as equipment
    update {
      if (equipment.serviceInterval.operatingHours === undefined){
        if (equipment.serviceInterval.title === '500 Hour Service')
          equipment.serviceInterval.operatingHours = 500;
        else
          equipment.serviceInterval.operatingHours = 250;
      }
    }`;

    const patch = new PatchByQueryOperation(indexQuery);
    const operation = await store.operations.send(patch);
    await operation.waitForCompletion();
  },
  down: async () => {
    console.log('2019-08-05-PatchEquipmentServiceInterval > down');
  },
};
