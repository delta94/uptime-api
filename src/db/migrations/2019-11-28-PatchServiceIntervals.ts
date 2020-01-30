import { IDocumentStore, IDocumentSession } from 'ravendb';
import { ServiceInterval } from '@/types/serviceInterval/ServiceInterval';
import shortid = require('shortid');
import { generate, characters } from 'shortid';

export default {
  name: '2019-11-28-PatchServiceIntervals',
  up: async (store: IDocumentStore) => {
    // Get all service intervals
    const session = store.openSession();
    const serviceIntervals = await session
      .query<ServiceInterval>({ indexName: 'ServiceIntervals' })
      .orderByDescending('updatedOn')
      // .whereEquals('title','Testing inserting with 2 milestones')
      // .take(5)
      .all();

    // session.dispose();

    await serviceIntervals.forEach(async item => {
      item.milestones.forEach((milestone, index) => {
        console.log('Milestone name', milestone.title);
        console.log('milestone.id', milestone.id);
        console.log('milestone.serviceItems.length', milestone.serviceItems.length);

        if (!milestone.id || milestone.id === undefined || milestone.id === null) {
          milestone.id = index;
          console.log('Setting milestone.id=', milestone.id);
        }
        milestone.serviceItems.forEach(serviceItem => {
          if (!serviceItem.id || serviceItem.id === undefined || serviceItem.id === null) {
            // use $ and @ instead of - and _
            characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
            const token = generate();
            serviceItem.id = token;
            console.log('Setting serviceItem.id=', serviceItem.id);
          }
          if (!serviceItem.fromMilestoneId || serviceItem.fromMilestoneId === undefined || serviceItem.fromMilestoneId === null) {
            serviceItem.fromMilestoneId = index.toString();
            console.log('Setting serviceItem.fromMilestoneId=', serviceItem.fromMilestoneId);
          }
        });
      });
    });
    session.saveChanges();
    console.log('Finished PatchServiceIntervals Update!');
  },
  down: async () => {
    console.log('2019-11-28-PatchServiceIntervals > down');
  },
};
