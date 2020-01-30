import { IDocumentStore, IndexQuery, PatchByQueryOperation } from 'ravendb';
import { Role } from '@/types/role/Role';

export default {
  name: '2019-07-17-PatchWorkOrdersEnum',
  up: async (store: IDocumentStore) => {
    const indexQuery = new IndexQuery();
    indexQuery.waitForNonStaleResults = true;

    indexQuery.query = `from index WorkOrders as workOrders
    update {
      if (workOrders.status==="Assessing Repair")
        workOrders.status = "AssessingRepair";
      else if (workOrders.status==="Waiting for Parts")
        workOrders.status = "WaitingForParts";
      else if (workOrders.status==="In Progress")
        workOrders.status = "InProgress";
    }`;

    const patch = new PatchByQueryOperation(indexQuery);
    const operation = await store.operations.send(patch);
    await operation.waitForCompletion();
  },
  down: async () => {
    console.log('2019-07-17-PatchWorkOrdersEnum > down');
  },
};
