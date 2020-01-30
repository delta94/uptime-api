import { IDocumentStore, IDocumentSession } from 'ravendb';
import { Equipment } from '@/types/equipment/Equipment';
import { Inspection } from '@/types/inspection/Inspection';

const equipmentFun = async (equipment: Equipment, store: IDocumentStore) => {
  const session = store.openSession();
  const inspections = await session
    .query<Inspection>({ indexName: 'Inspections' })
    .whereEquals('equipmentId', equipment.id)
    .orderByDescending('createdOn')
    .all();

  if (!equipment.meterValue || equipment.meterValue === null || equipment.meterValue === NaN) equipment.meterValue = 0;

  inspections.forEach(inspection => {
    if (inspection.meterValue) equipment.meterValue = equipment.meterValue + inspection.meterValue;
  });

  console.log('Id, MeterValue =', equipment.id, equipment.meterValue);
  await session.store<Equipment>(equipment);
  await session.saveChanges();
  session.dispose();
};

export default {
  name: '2019-07-31-PatchEquipmentMeterValueManual',
  up: async (store: IDocumentStore) => {
    // Get all equipment
    const session = store.openSession();
    const equipment = await session
      .query<Equipment>({ indexName: 'Equipment' })
      .orderByDescending('updatedOn')
      // .take(2)
      .all();

    session.dispose();

    await equipment.forEach(async equipment => {
      if (!equipment.meterValue || equipment.meterValue === 0) {
        equipmentFun(equipment, store);
      }
    });
    console.log('Finished Equipment Update!');
  },
  down: async () => {
    console.log('2019-07-31-PatchEquipmentMeterValueManual > down');
  },
};
