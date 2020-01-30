import initializeStore from '../db';
import dotenv from 'dotenv';
import { Equipment } from '@/types/equipment/Equipment';
import { EquipmentReference } from '@/types/equipment/EquipmentReference';

(async () => {
  try {
    dotenv.config();

    console.log('Started Removal of Assets');

    const store = await initializeStore();
    const session = store.openSession();
    try {
      const fluidReports = await session.query<any>({ indexName: 'FluidReports' }).all();
      for (const fluidReport of fluidReports) {
        if (fluidReport.asset) delete fluidReport.asset;
        // await session.saveChanges();
      }

      const inspections = await session.query<any>({ indexName: 'Inspections' }).all();
      for (const inspection of inspections) {
        if (inspection.asset) delete inspection.asset;
        // await session.saveChanges();
      }

      const workOrders = await session.query<any>({ indexName: 'WorkOrders' }).all();
      for (const workOrder of workOrders) {
        if (workOrder.asset) delete workOrder.asset;
        // await session.saveChanges();
      }

      const usageLogs = await session.query<any>({ indexName: 'EquipmentUsageLog' }).all();
      for (const usageLog of usageLogs) {
        if (usageLog.asset) delete usageLog.asset;
      }
      await session.saveChanges();

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
