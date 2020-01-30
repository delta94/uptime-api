import { IDocumentStore, IndexQuery, PatchByQueryOperation } from 'ravendb';
import { Role } from '@/types/role/Role';

export default {
  name: '2019-07-09-PatchIsDefaultStatuses',
  up: async (store: IDocumentStore) => {
    const indexQuery = new IndexQuery();
    indexQuery.waitForNonStaleResults = true;
    indexQuery.query = `from index InspectionTemplates as inspectionTemplates
    update {
      const index = inspectionTemplates.checklist.forEach(checkListItem => {
        if(checkListItem.statuses.length>0) {
          checkListItem.statuses.forEach((status,index) => {
            if (status.isDefault == undefined || status.isDefault == null || !status.isDefault ){
              if (index===0)
                status.isDefault=true;
              else 
                status.isDefault=false;
            }
          })
        }
      })
      }`;

    const patch = new PatchByQueryOperation(indexQuery);
    const operation = await store.operations.send(patch);
    await operation.waitForCompletion();
  },
  down: async () => {
    console.log('2019-07-09-PatchIsDefaultStatuses > down');
  },
};


