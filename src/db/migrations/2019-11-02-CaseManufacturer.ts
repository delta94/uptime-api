import { IDocumentStore } from 'ravendb';
import { v1 } from 'uuid';
import { User } from '../../schema/types/user/User';
import { Role } from '../../schema/types/role/Role';
import { UserRoleReference } from '../../schema/types/role/UserRoleReference';
import { Equipment } from '@/types/equipment/Equipment';
import { capitalizeEachFirstLetter } from '@/helpers/utils';

export default {
  name: '2019-11-02-CaseManufacturer',
  up: async (store: IDocumentStore) => {
    const session = store.openSession();
    const equipment = await session.query<Equipment>({ collection: 'Equipment' }).all();
    equipment.forEach(e => (e.make = capitalizeEachFirstLetter(e.make)));
    await session.saveChanges();
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-11-02-CaseManufacturer > down');
  },
};
