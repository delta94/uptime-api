import initializeStore from '../db';
import dotenv from 'dotenv';
import { Equipment } from '@/types/equipment/Equipment';
import { Inspection } from '@/types/inspection/Inspection';
import { PatchOperation, PatchRequest, PutDocumentCommand } from 'ravendb';
import { DetailedEquipmentReference } from '@/types/equipment/DetailedEquipmentReference';
import { find } from 'lodash';
import { InspectionTemplate } from '@/types/inspectionTemplate/InspectionTemplate';
import { getShortUuid } from '@/helpers/utils';

(async () => {
  try {
    dotenv.config();

    console.log('Started Update of Fluid Reports and Metadata');

    const store = await initializeStore();
    const session = store.openSession();
    try {
      const inspectionTemplates = await session.query<InspectionTemplate>({ indexName: 'InspectionTemplates' }).all();
      console.log('inspectionTemplates.length', inspectionTemplates.length);

      for (const template of inspectionTemplates) {
        if (template.id.includes('InspectionTemplates')) {
          template.checklist.forEach(item => {
            if (!item.id || item.id === undefined || item.id === '') {
              item.id = getShortUuid();
            }
          });
          // const userCommand = new PutDocumentCommand(template.id, null, template);
          // await session.advanced.requestExecutor.execute(userCommand);
          // console.log(fluidReport.updatedOn, fluidReport.id, JSON.stringify(fluidReport['@metadata'], null, 1), JSON.stringify(fluidReport.equipment, null, 1)); // , JSON.stringify(metadata, null, 1));
          // console.log(JSON.stringify(workOrder['@metadata'], null, 1)); // , JSON.stringify(metadata, null, 1));
          // console.log(JSON.stringify(workOrder.equipment, null, 1)); // , JSON.stringify(metadata, null, 1));
        }
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
