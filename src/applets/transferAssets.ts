import initializeStore from '../db';
import dotenv from 'dotenv';
import { Equipment } from '@/types/equipment/Equipment';
import { EquipmentReference } from '@/types/equipment/EquipmentReference';

(async () => {
  try {
    dotenv.config();

    console.log('Started Transfer of Assets to Equipment');

    const store = await initializeStore();
    const session = store.openSession();
    try {
      const assets = await session.query<any>({ indexName: 'Equipment' }).all();

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
            await session.saveChanges();
          }
        }

        const inspections = await session
          .query<any>({ indexName: 'Inspections' })
          .whereEquals('assetId', asset.id)
          .all();

        if (inspections && inspections.length > 0) {
          for (const inspection of inspections) {
            inspection.equipment = new EquipmentReference(e.id, e.name, e.nickname, e.meterType);
            await session.saveChanges();
          }
        }

        const workOrders = await session
          .query<any>({ indexName: 'WorkOrders' })
          .whereEquals('assetId', asset.id)
          .all();

        if (workOrders && workOrders.length > 0) {
          for (const workOrder of workOrders) {
            workOrder.equipment = new EquipmentReference(e.id, e.name, e.nickname, e.meterType);
            await session.saveChanges();
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
            await session.saveChanges();
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
