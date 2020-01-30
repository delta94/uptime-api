import { IDocumentStore, IndexQuery, PatchByQueryOperation } from 'ravendb';

export default {
  name: '2020-01-17-PatchWorkEntry',
  up: async (store: IDocumentStore) => {
    const indexQuery = new IndexQuery();
    indexQuery.waitForNonStaleResults = true;

    indexQuery.query = `from index WorkOrders as workOrder
    update {
      if (workOrder.workEntries === undefined ){
        workOrder.workEntries = [];
      }
      if (typeof (workOrder.workEntries) === "object"){
        workOrder.workEntries = [];
      }     
    }`;

    const patch = new PatchByQueryOperation(indexQuery);
    const operation = await store.operations.send(patch);
    await operation.waitForCompletion();
  },
  down: async () => {
    console.log('2020-01-17-PatchWorkEntry > down');
  },
};
