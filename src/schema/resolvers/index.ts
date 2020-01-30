import { buildSchema } from 'type-graphql';
// import { AuthorBookResolver } from "../modules/author-book/AuthorBookResolver";
import { EquipmentResolver } from './equipment';
import { ClientResolver } from './clients';
import { DealerResolver } from './dealers';
import { InspectionResolver } from './inspections';
import { InspectionTemplateResolver } from './inspectionTemplates';
import { MakeResolver } from './makes';
import { PaymentPlanResolver } from './paymentPlans';
import { RoleResolver } from './roles';
import { UserResolver } from './users';
import { AwsResolver } from './aws';
import { ServiceIntervalResolver } from './serviceIntervals';
import { WorkOrderResolver } from './workOrders';
import { FluidResolver } from './fluids';
import { LogEntryResolver } from './logEntries';
import { OfficeLocationsResolver } from './officeLocation';
import { JobResolver } from './jobs';
import { RolePermissionResolver } from './rolePermissions';
import { CommonResolver } from './common';
import { NotificationResolver } from './notifications';
import { WwwResolver } from './wwwResolver';

export const createSchema = () =>
  buildSchema({
    resolvers: [
      EquipmentResolver,
      ClientResolver,
      DealerResolver,
      InspectionResolver,
      InspectionTemplateResolver,
      MakeResolver,
      PaymentPlanResolver,
      RoleResolver,
      UserResolver,
      AwsResolver,
      ServiceIntervalResolver,
      WorkOrderResolver,
      FluidResolver,
      LogEntryResolver,
      OfficeLocationsResolver,
      JobResolver,
      RolePermissionResolver,
      CommonResolver,
      NotificationResolver,
      WwwResolver,
    ],
    // authChecker: ({ context: { req } }) => {
    //   return !!req.session.userId;
    // },
    dateScalarMode: 'isoDate',
    validate: false,
  });
