import 'reflect-metadata';
import { getAppSettings } from '@/helpers/utils';
import * as fs from 'fs';
import { some } from 'lodash';
import { DateTime } from 'luxon';
import moment from 'moment';
import * as path from 'path';
import migrations from './migrations';
import { DocumentStore, IDocumentStore } from 'ravendb';
import { Migrations as AppSettingMigrations } from '@/types/appSettings/Migrations';
import { AppSettings } from '@/types/appSettings/AppSettings';
import { Client } from '@/types/client/Client';
import { User } from '@/types/user/User';
import { Role } from '@/types/role/Role';
import { Equipment } from '@/types/equipment/Equipment';
import { Manufacturer } from '@/types/manufacturer/Manufacturer';
import { PaymentPlan } from '@/types/paymentPlan/PaymentPlan';
import { InspectionTemplate } from '@/types/inspectionTemplate/InspectionTemplate';
import { Dealer } from '@/types/dealer/Dealer';
import { Inspection } from '@/types/inspection/Inspection';
import { WorkOrder } from '@/types/workOrder/WorkOrder';
import { ServiceInterval } from '@/types/serviceInterval/ServiceInterval';
import { LogEntry } from '@/types/logEntry/LogEntry';
import { EquipmentUsageLog } from '@/types/equipmentUsageLog/EquipmentUsageLog';
import { OfficeLocation } from '@/types/officeLocation/OfficeLocation';
import { Job } from '@/types/job/Job';

export default async (): Promise<IDocumentStore> => {
  const { DATABASE_NAME, DATABASE_URL, PFX_SECRET_KEY, PFX_NAME } = process.env;

  let store: IDocumentStore;
  if (DATABASE_URL.indexOf('localhost') < 0) {
    const certificate = path.resolve(`./${PFX_NAME}`);

    console.log(`Certificate: ${PFX_NAME}`);
    console.log(`DatabaseUrl: ${DATABASE_URL}`);
    console.log(`DatabaseName: ${DATABASE_NAME}`);

    store = new DocumentStore(DATABASE_URL, DATABASE_NAME, {
      certificate: fs.readFileSync(certificate),
      type: 'pfx',
      password: PFX_SECRET_KEY,
    });
  } else {
    console.log(`Running RavenDB via localhost...`);
    console.log(`DatabaseUrl: ${DATABASE_URL}`);
    console.log(`DatabaseName: ${DATABASE_NAME}`);
    store = new DocumentStore(DATABASE_URL, DATABASE_NAME);
  }

  store.conventions.storeDatesInUtc = true;
  store.conventions.transformClassCollectionNameToDocumentIdPrefix = type => `${type[0].toUpperCase()}${type.slice(1)}`;
  store.conventions.maxNumberOfRequestsPerSession = 9999999;

  store.conventions.registerEntityType(AppSettings);
  store.conventions.registerEntityType(Client);
  store.conventions.registerEntityType(User);
  store.conventions.registerEntityType(Role);
  store.conventions.registerEntityType(Equipment);
  store.conventions.registerEntityType(Manufacturer);
  store.conventions.registerEntityType(PaymentPlan);
  store.conventions.registerEntityType(InspectionTemplate);
  store.conventions.registerEntityType(Inspection);
  store.conventions.registerEntityType(Dealer);
  store.conventions.registerEntityType(WorkOrder);
  store.conventions.registerEntityType(ServiceInterval);
  store.conventions.registerEntityType(LogEntry);
  store.conventions.registerEntityType(EquipmentUsageLog);
  store.conventions.registerEntityType(OfficeLocation);
  store.conventions.registerEntityType(Job);

  store.initialize();
  await migrate(store);
  console.log('Done with Migrations');

  return store;
};

const migrate = async (store: IDocumentStore): Promise<void> => {
  console.log(`Checking For Migrations`);
  const session = store.openSession();
  let appSettings = await getAppSettings<AppSettingMigrations>(session, 'Migrations');
  if (!appSettings) {
    appSettings = new AppSettings([]);
    await session.store(appSettings, 'AppSettings/Migrations');
  }
  for (const migration of Object.keys(migrations)) {
    try {
      const alreadyExecuted = some(appSettings.data, { migration });
      if (!alreadyExecuted) {
        console.log(`Executing Migration: ${migration}`);
        await migrations[migration].up(store);
        appSettings.data.push({ executedOn: moment().toDate(), migration });
        appSettings.updatedOn = DateTime.utc().toJSDate();
      }
    } catch (ex) {
      console.log(`Executing Migration: ${migration} Error > ${ex.message}`);
      await migrations[migration].down(store);
    }
  }
  await session.saveChanges();
};
