import { IDocumentStore, IndexQuery, PatchByQueryOperation } from 'ravendb';
import { Role } from '@/types/role/Role';

export default {
  name: '2019-07-17-PatchEquipmentMeter',
  up: async (store: IDocumentStore) => {
    const indexQuery = new IndexQuery();
    indexQuery.waitForNonStaleResults = true;

    indexQuery.query = `from index Equipment as equipment
    update {
      if (equipment.meterType === undefined)
        equipment.meterType = "Hours";
    }`;

    const patch = new PatchByQueryOperation(indexQuery);
    const operation = await store.operations.send(patch);
    await operation.waitForCompletion();
  },
  down: async () => {
    console.log('2019-07-17-PatchEquipmentMeter > down');
  },
};
