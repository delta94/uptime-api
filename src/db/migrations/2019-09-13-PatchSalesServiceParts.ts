import { IDocumentStore, IndexQuery, PatchByQueryOperation } from 'ravendb';
import { Role } from '@/types/role/Role';

export default {
  name: '2019-09-13-PatchSalesServiceParts',
  up: async (store: IDocumentStore) => {
    const indexQuery = new IndexQuery();
    indexQuery.waitForNonStaleResults = true;

    indexQuery.query = `from index Dealers as dealer
    update {
      if (dealer.sales === undefined ){
        dealer.sales = [];
      }
      if (typeof (dealer.sales) === "object"){
        dealer.sales = [];
      }

      if (dealer.service === undefined ){
        dealer.service = [];
      }
      if (typeof (dealer.service) === "object"){
        dealer.service = [];
      }

      if (dealer.parts === undefined ){
        dealer.parts = [];
      }
      if (typeof (dealer.parts) === "object"){
        dealer.parts = [];
      }
    }`;

    const patch = new PatchByQueryOperation(indexQuery);
    const operation = await store.operations.send(patch);
    await operation.waitForCompletion();
  },
  down: async () => {
    console.log('2019-09-13-PatchSalesServiceParts > down');
  },
};
