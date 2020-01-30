import { IDocumentStore, IndexQuery, PatchByQueryOperation } from 'ravendb';
import * as indexes from './indexes';
import { Equipment } from '@/types/equipment/Equipment';
import { EquipmentReference } from '@/types/equipment/EquipmentReference';
import { Role } from '@/types/role/Role';
import { User } from '@/types/user/User';
import { InspectionTemplate } from '@/types/inspectionTemplate/InspectionTemplate';

export default {
  name: '2019-08-31-MigrateAssets',
  up: async (store: IDocumentStore) => {
    const session = store.openSession();
    try {
      const assets = await session.query<any>({ indexName: 'Assets' }).all();

      for (const asset of assets) {
        const e = await Equipment.fromAny(asset);
        await session.store<Equipment>(e);
        const metadata = session.advanced.getMetadataFor(e);
        metadata['@collection'] = 'Equipment';
        await session.saveChanges();

        const fluidReports = await session
          .query<any>({ indexName: 'FluidReports' })
          .whereEquals('assetId', asset.id)
          .all();

        if (fluidReports && fluidReports.length > 0) {
          for (const fluidReport of fluidReports) {
            fluidReport.equipment = new EquipmentReference(e.id, e.name, e.nickname, e.meterType);
            delete fluidReport.asset;
          }
        }

        const inspections = await session
          .query<any>({ indexName: 'Inspections' })
          .whereEquals('assetId', asset.id)
          .all();

        if (inspections && inspections.length > 0) {
          for (const inspection of inspections) {
            inspection.equipment = new EquipmentReference(e.id, e.name, e.nickname, e.meterType);
            delete inspection.asset;
          }
        }

        const workOrders = await session
          .query<any>({ indexName: 'WorkOrders' })
          .whereEquals('assetId', asset.id)
          .all();

        if (workOrders && workOrders.length > 0) {
          for (const workOrder of workOrders) {
            workOrder.equipment = new EquipmentReference(e.id, e.name, e.nickname, e.meterType);
            delete workOrder.asset;
          }
        }

        const usageLogs = await session
          .query<any>({ indexName: 'EquipmentUsageLog' })
          .whereEquals('assetId', asset.id)
          .all();

        if (usageLogs && usageLogs.length > 0) {
          for (const usageLog of usageLogs) {
            usageLog.equipment = new EquipmentReference(e.id, e.name, e.nickname, e.meterType);
            delete usageLog.asset;
          }
        }
      }

      const roles = await session.query<Role>({ collection: 'Roles' }).all();
      for (const role of roles) {
        for (const permission of role.permissions) {
          if (permission.name === 'Assets') {
            permission.name = 'Equipment';
          }
        }
      }

      const users = await session.query<User>({ collection: 'Users' }).all();
      for (const user of users) {
        for (const role of user.roles) {
          for (const permission of role.permissions) {
            if (permission.name === 'Assets') {
              permission.name = 'Equipment';
            }
          }
        }
      }

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
  },
  down: async (store: IDocumentStore) => {
    console.log('2019-08-31-MigrateAssets > down');
  },
};
