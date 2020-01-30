import { IDocumentStore } from 'ravendb';
import * as indexes from './indexes';

export default {
  name: '2020-01-23-NotificationsIndex',
  up: async (store: IDocumentStore) => {
    await store.executeIndex(new indexes.Notifications()); 
  },
  down: async (store: IDocumentStore) => {
    console.log('2020-01-23-NotificationsIndex > down');
  },
};
