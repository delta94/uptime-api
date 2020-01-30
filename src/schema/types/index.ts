import * as appSettings from './appSettings';
import * as equipment from './equipment';
import * as aws from './aws';
import * as client from './client';
import * as dealer from './dealer';
import * as inspections from './inspection';
import * as inspectionTemplate from './inspectionTemplate';
import * as make from './make';
import * as paymentPlan from './paymentPlan';
import * as role from './role';
import * as serviceIntervals from './serviceInterval';
import * as user from './user';
import * as workOrder from './workOrder';
import { JwtUser } from './JwtUser';
import * as Enums from './Enums';
import { TablePaginationArgs } from './TablePaginationArgs';
import { TablePaginationWithSearchTextArgs } from './TablePaginationWithSearchTextArgs';
import fluids from './fluids';
import equipmentUsageLog from './equipmentUsageLog';
import dealerContact from './dealerContact';

export default {
  ...appSettings,
  ...equipment,
  ...aws,
  ...client,
  ...dealer,
  ...inspections,
  ...inspectionTemplate,
  ...make,
  ...paymentPlan,
  ...role,
  ...serviceIntervals,
  ...user,
  ...workOrder,
  ...fluids,
  ...equipmentUsageLog,
  ...dealerContact,
  ...Enums,
  JwtUser,
  TablePaginationArgs,
  TablePaginationWithSearchTextArgs,
};
