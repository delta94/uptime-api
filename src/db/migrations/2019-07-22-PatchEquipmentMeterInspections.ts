import { IDocumentStore, IndexQuery, PatchByQueryOperation } from 'ravendb';
import { Role } from '@/types/role/Role';

export default {
  name: '2019-07-22-PatchEquipmentMeterInspections',
  up: async (store: IDocumentStore) => {
    const indexQuery = new IndexQuery();
    indexQuery.waitForNonStaleResults = true;

    indexQuery.query = `from index Inspections as inspection
    update {
      if (inspection.equipment.meterType === undefined)
        inspection.equipment.meterType = "Hours";
      else if (inspection.equipment.meterType === "Other")
        inspection.equipment.meterType = "";
      else if (inspection.equipment.meterType === "Tracked")
        inspection.equipment.meterType = "Hours";
      else if (inspection.equipment.meterType === "Wheeled")
        inspection.equipment.meterType = "Miles";

      inspection.meterValue = inspection.hours ? inspection.hours : inspection.miles;
      delete inspection.hours;
      delete inspection.miles;
    }`;

    const patch = new PatchByQueryOperation(indexQuery);
    const operation = await store.operations.send(patch);
    await operation.waitForCompletion();
  },
  down: async () => {
    console.log('2019-07-22-PatchEquipmentMeterInspections > down');
  },
};
