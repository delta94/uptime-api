import initializeStore from '../db';
import dotenv from 'dotenv';
import { Equipment } from '@/types/equipment/Equipment';
import { EquipmentReference } from '@/types/equipment/EquipmentReference';
import { Role } from '@/types/role/Role';
import { User } from '@/types/user/User';

(async () => {
  try {
    dotenv.config();

    console.log('Started Transfer of Assets to Equipment');

    const store = await initializeStore();
    const session = store.openSession();
    try {
      const roles = await session.query<Role>({ collection: 'Roles' }).all();
      for (const role of roles) {
        for (const permission of role.permissions) {
          if (permission.name === 'Assets') {
            permission.name = 'Equipment';
            await session.saveChanges();
          }
        }
      }

      const users = await session.query<User>({ collection: 'Users' }).all();
      for (const user of users) {
        for (const role of user.roles) {
          for (const permission of role.permissions) {
            if (permission.name === 'Assets') {
              permission.name = 'Equipment';
              await session.saveChanges();
            }
          }
        }
      }

      process.exit(1);
    } catch (ex) {
      console.log(ex.message);
      process.exit(1);
    }
  } catch (ex) {
    console.log(ex.message);
    process.exit(1);
  }
})();
