import dotenv from 'dotenv';
import excelToJson from 'convert-excel-to-json';
import * as path from 'path';
import 'reflect-metadata';

import initializeStore from '../db';
import { Equipment } from '@/types/equipment/Equipment';
import { Client } from '@/types/client/Client';
import { OfficeLocation } from '@/types/officeLocation/OfficeLocation';
import { OfficeLocationReference } from '@/types/officeLocation/OfficeLocationReference';
import { IdNameReference } from '@/types/common/IdNameReference';
import { capitalizeEachFirstLetter } from '@/helpers/utils';

const getEquipment = (sheet: string, filename: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const result = excelToJson({
      sourceFile: path.resolve(`./src/applets/${filename}`),
      range: 'B5:K100',
      sheets: [sheet],
      // header: {
      //   // Is the number of rows that will be skipped and will not be present at our result object. Counting from top to bottom
      //   rows: 1, // 2, 3, 4, etc.
      // },
      columnToKey: {
        B: 'make',
        C: 'model',
        D: 'nickname',
        E: 'classification',
        F: 'year',
        G: 'vinOrSerial',
        H: 'type',
        I: 'meterType',
        J: 'location',
      },
    });

    resolve(result);

    //   node_xj(
    //     {
    //       input: path.resolve(`./env/${filename}`),
    //       output: null,
    //       sheet: sheet,
    //     },
    //     async function(err, result: any[]) {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve(result);
    //       }
    //     }
    //   );
  });
};

(async () => {
  try {
    dotenv.config();

    // argv[2] = Excel File Name
    // argv[3] = Client ID

    if (process.argv.length !== 4) {
      console.log('process.argv', process.argv);
      console.log('Usage: NODE_ENV=development ts-node -r tsconfig-paths/register --files src/applets/import-equipment-list.ts {excel-file-name} {clientId}');
      process.exit(0);
    }

    const store = await initializeStore();
    const session = store.openSession();

    console.log(`Started Import of ${process.argv[2]} for ${process.argv[3]}`);

    const data: any = await getEquipment('Sheet1', process.argv[2]);
    const entities: Equipment[] = [];

    const client = await session.load<Client>(process.argv[3]);
    if (client) {
      for (const item of data['Sheet1']) {
        let officeLocation = await session
          .query<OfficeLocation>({ indexName: 'OfficeLocations' })
          .whereEquals('clientId', client.id)
          .whereEquals('name', item.location)
          .firstOrNull();

        if (!officeLocation) {
          officeLocation = new OfficeLocation(capitalizeEachFirstLetter(item.location, false), [], [], [], [], []);
          officeLocation.client = IdNameReference.fromIdAndNameType(client);
          await session.store(officeLocation);
          await session.saveChanges();
        }

        const equipment = Equipment.fromImport(item);
        equipment.officeLocation = OfficeLocationReference.fromOfficeLocation(officeLocation);
        equipment.client = IdNameReference.fromIdAndNameType(client);
        console.log('item.location', item.location, equipment.id, equipment.client.name, equipment.officeLocation.name);

        entities.push(equipment);
      }

      // console.log('entities', entities);

      const tryBulkUpdate = store.bulkInsert();
      for (const equipment of entities) {
        await tryBulkUpdate.store(equipment);
      }
      await tryBulkUpdate.finish();
      console.log(`Finished Importing Equipment for ${client.name}`);
      process.exit(1);
    } else {
      console.log('Client Not Found');
      process.exit(0);
    }
  } catch (ex) {
    console.log(ex.message);
    process.exit(1);
  }
})();
