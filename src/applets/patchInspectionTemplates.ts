import initializeStore from '../db';
import dotenv from 'dotenv';
import { Equipment } from '@/types/equipment/Equipment';
import { EquipmentReference } from '@/types/equipment/EquipmentReference';
import { Role } from '@/types/role/Role';
import { User } from '@/types/user/User';

(async () => {
  try {
    dotenv.config();

    console.log('Started Transfer of Inspection Templates assetType to equipmentType');

    const store = await initializeStore();
    const session = store.openSession();

    const templates = await session.query<any>({ collection: 'InspectionTemplates' }).all();
    for (const template of templates) {
      template.equipmentType = template.assetType;
      delete template.assetType;
    }

    await session.saveChanges();
    process.exit(1);
  } catch (ex) {
    console.log(ex.message);
    process.exit(1);
  }
})();
