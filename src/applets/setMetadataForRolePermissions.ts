import initializeStore from '../db';
import dotenv from 'dotenv';
import { Equipment } from '@/types/equipment/Equipment';
import { WorkOrder } from '@/types/workOrder/WorkOrder';
import { PutDocumentCommand } from 'ravendb';
import inspection from '@/types/inspection';
import e from 'express';
import { RolePermission } from '@/types/role/RolePermission';
import { getNowUtc } from '@/helpers/utils';

(async () => {
  try {
    dotenv.config();
    console.log('ts-node -r tsconfig-paths/register src/applets/setMetadataForRolePermissions.ts');
    console.log('Started Updating Role Permission Metadata');

    const store = await initializeStore();
    const session = store.openSession();
    try {
      const rolePermissions = await session
        .query<any>({ indexName: 'RolePermissions' })
        .all();

      for (const rolePermission of rolePermissions) {
        if (rolePermission.id.includes('RolePermissions')) {
          const metadata = session.advanced.getMetadataFor(rolePermission);

          rolePermission.createdOn = getNowUtc();
          rolePermission.updatedOn = getNowUtc();
          rolePermission['@metadata']['@nested-object-types'] = {
            ...metadata['@nested-object-types'],
            createdOn: 'date',
            updateOn: 'date',
          };

          console.log(`rolePermission.id`, rolePermission.id, rolePermission['@metadata']['Raven-Node-Type']);
          // workOrder['@metadata']['Raven-Node-Type'] = 'WorkOrder';
          // console.log(JSON.stringify(rolePermission['@metadata'], null, 1));

          const putCommand = new PutDocumentCommand(rolePermission.id, null, rolePermission);
          await session.advanced.requestExecutor.execute(putCommand);

          // await session.saveChanges();
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
