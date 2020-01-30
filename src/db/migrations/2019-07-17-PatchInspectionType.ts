import { IDocumentStore, IndexQuery, PatchByQueryOperation } from 'ravendb';
import { Role } from '@/types/role/Role';

export default {
  name: '2019-07-17-PatchInspectionType',
  up: async (store: IDocumentStore) => {
    const indexQuery = new IndexQuery();
    indexQuery.waitForNonStaleResults = true;

    indexQuery.query = `from index Inspections as inspections
    update {
      if (inspections.type==="Pre-Shift")
        inspections.type = "PreShift";
      else if (inspections.type==="Post-Shift")
        inspections.type = "PostShift";
    }`;

    const patch = new PatchByQueryOperation(indexQuery);
    const operation = await store.operations.send(patch);
    await operation.waitForCompletion();
  },
  down: async () => {
    console.log('2019-07-17-PatchInspectionType > down');
  },
};
