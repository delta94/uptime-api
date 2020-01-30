import initializeStore from '../db';
import dotenv from 'dotenv';
import { Client } from '@/types/client/Client';
import { InspectionTemplate } from '@/types/inspectionTemplate/InspectionTemplate';
import { DateTime } from 'luxon';
import { capitalizeEachFirstLetter } from '@/helpers/utils';
import { IdNameReference } from '@/types/common/IdNameReference';
import { EntitiesCollectionObject } from 'ravendb';

const exclusions = [
  'DAILY SHREDDER ENGINE AND RADIATOR GROUPS INSPECTION',
  'NIGHT SHIFT PRE PRODUCTION PM',
  'DAILY EDDY LINE INSPECTION',
  'WELDERS DAILY MILL INSPECTION (SPANISH)',
];

// const inclusions = ['Truck Pre-Trip/Post-Trip Inspection', 'DAILY EXCAVATOR W/GRAPPLE INSPECTION', 'DAILY FORKLIFT INSPECTION'];
// const inclusions = [
//   'DAILY EXCAVATOR W/Shear INSPECTION',
//   'DAILY SKID STEER INSPECTION (TRACKED)',
//   'DAILY SKID STEER INSPECTION (WHEELED)',
//   'DAILY LOADER INSPECTION',
// ];

// !!!!!!!!!!!!!!! FINAL FOR NEW CLIENT !!!!!!!!!!!!!!!!!
const inclusions = [
  'InspectionTemplates/706-A', // 'DAILY EXCAVATOR W/Shear INSPECTION',
  // 'InspectionTemplates/387-A', // 'DAILY SKID STEER INSPECTION (TRACKED)',
  'InspectionTemplates/386-A', // 'DAILY SKID STEER INSPECTION (WHEELED)',
  // 'ROLL OFF PRE/POST TRIP INSPECTION',
  'InspectionTemplates/292-A', // 'DAILY FORKLIFT INSPECTION',
  // 'DAILY WELDER INSPECTION',
  // 'DAILY LOADER INSPECTION',
  // 'Truck Pre-Trip/Post-Trip Inspection',
  // 'DAILY EXCAVATOR W/MAG INSPECTION',
  'InspectionTemplates/673-A', // 'DAILY EXCAVATOR W/GRAPPLE INSPECTION',
  'InspectionTemplates/293-A', // Daily Loader inspection
];
// !!!!!!!!!!!!!!! FINAL FOR NEW CLIENT !!!!!!!!!!!!!!!!!

// const inclusions = [
//   'InspectionTemplates/322-A', // 'ROLL OFF PRE/POST TRIP INSPECTION',
//   'InspectionTemplates/833-A',
// ];

// const inclusions = ['Pre-Trip/ Post Trip Truck Inspection Wet Line'];

(async () => {
  try {
    dotenv.config();

    console.log('Started Transfer of Inspection Templates');
    if (process.argv.length !== 3) {
      console.log('Usage: ts-node -r tsconfig-paths/register src/applets/transferInspectionTemplates.ts clientId');
      process.exit(0);
    }

    const store = await initializeStore();
    const session = store.openSession();
    try {
      const client = await session.load<Client>(process.argv[2]);
      if (client) {
        console.log(client.name);

        const templates = await session
          .query<InspectionTemplate>({ collection: 'InspectionTemplates' })
          .whereEquals('forOnboarding', true)
          .all();

        console.log(
          'templates',
          templates.reduce((p, c) => p.concat([capitalizeEachFirstLetter(c.title)]), new Array<string>())
        );
        for (const t of templates) {
          if (!exclusions.includes(t.title)) {
            const count = await session
              .query<InspectionTemplate>({ indexName: 'InspectionTemplates' })
              .whereEquals('title', capitalizeEachFirstLetter(t.title))
              .whereEquals('clientId', client.id)
              .count();

            if (count <= 0) {
              const newCloned = await InspectionTemplate.fromInspectionTemplateInput(session, {
                checklist: t.checklist,
                title: capitalizeEachFirstLetter(t.title),
                equipmentType: t.equipmentType,
                classification: capitalizeEachFirstLetter(t.classification, false),
                attachment: t.attachment,
                language: t.language,
              });
              newCloned.createdOn = DateTime.utc().toJSDate();
              newCloned.updatedOn = DateTime.utc().toJSDate();
              newCloned.client = IdNameReference.fromIdAndNameType(client);
              newCloned.forOnboarding = false;
              console.log(
                'JSON.stringify(newCloned, null, 1)',
                JSON.stringify({ classification: newCloned.classification, equipmentType: newCloned.equipmentType, attachment: newCloned.attachment }, null, 1)
              );
              await session.store(newCloned);
            } else {
              console.log(`Skipping "${capitalizeEachFirstLetter(t.title)}"`);
            }
          }
        }
        await session.saveChanges();
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
