import { IDocumentStore, IndexQuery, PatchByQueryOperation } from 'ravendb';

export default {
  name: '2020-01-23-PatchInspectionTemplates',
  up: async (store: IDocumentStore) => {
    const indexQuery = new IndexQuery();
    indexQuery.waitForNonStaleResults = true;

    // const redHex = '#FF0000';
    // const yellowHex = '#E7B416';
    // const greenHex = '#31A449';
    indexQuery.query = `from index InspectionTemplates as inspectionTemplates
    update {
        if(inspectionTemplates.checklist && inspectionTemplates.checklist.length) { 
          inspectionTemplates.checklist.forEach(checkListItem => {
            if(checkListItem.statuses && checkListItem.statuses.length > 0) {
              checkListItem.statuses.forEach((status, index) => {
                if (status.color === undefined ){
                  if (status.shouldSendAlert === undefined || status.shouldSendAlert === false) {
                    if (status.text === 'Good' || status.text === 'Good/Bien') {
                      status.color = '#31A449'; // green
                    } else if (status.text === 'Bien') {
                      status.color = '#31A449'; // green
                    } else if (status.text === 'Monitor' || status.text === "Monitor/Monitorizar") {
                      status.color = '#E7B416'; // yellow
                    } else if (status.text === 'Monitorizar') {
                      status.color = '#E7B416'; // yellow
                    } else {
                      status.color = '#FF0000'; // red
                    }
                  } else if (status.shouldSendAlert === true) {
                    status.color = '#FF0000'; // red
                  }
                }
              })
            }
          })
        }
      }`;

    const patch = new PatchByQueryOperation(indexQuery);
    const operation = await store.operations.send(patch);
    await operation.waitForCompletion();
  },
  down: async () => {
    console.log('2020-01-23-PatchInspectionTemplates > down');
  },
};
