import ClientsIndex from './2019-08-05-ClientIndex';
import RolesIndex from './2019-07-10-RoleIndex';
import SeedAdminUsers from './2019-01-02-SeedAdminUsers';
import UsersIndex from './2019-07-10-UserIndex';
import UsersIndex1021 from './2019-10-21-UserIndex';
import DealersIndex from './2019-09-13-DealerIndex';
import InspectionIndex from './2019-08-16-InspectionIndex';
import InspectionIndex0831 from './2019-08-31-InspectionIndex';
import InspectionTemplatesIndex from './2019-07-10-InspectionTemplatesIndex';
import ServiceIntervalsIndex from './2019-08-02-ServiceIntervals';
import ManufacturersIndex from './2019-08-20-ManufacturersIndex';
import PaymentPlansIndex from './2019-06-17-PaymentPlansIndex';
import EquipmentIndex from './2019-08-21-EquipmentIndex';
import FluidReportsIndex from './2020-01-20-FluidReportsIndex';
import FluidReportsIndex0831 from './2019-08-31-FluidReportsIndex';
import FluidReportPermissions from './2019-07-03-FluidReportPermissions';
import InspectionsPermissions from './2019-07-08-InspectionsPermissions';
import PatchIsDefaultStatuses from './2019-07-09-PatchIsDefaultStatuses';
import PatchInspectionType from './2019-07-17-PatchInspectionType';
import PatchWorkOrdersEnum from './2019-07-17-PatchWorkOrdersEnum';
import PatchEquipmentMeter from './2019-07-17-PatchEquipmentMeter';
import PatchEquipmentMeterInspections from './2019-07-29-PatchEquipmentMeterInspections';
import PatchEquipmentServiceInterval from './2019-07-31-PatchEquipmentMeterValueManual';
import PatchEquipmentMeterValueManual from './2019-08-05-PatchEquipmentServiceInterval';
import FluidsByDayIndex from './2019-08-25-FluidsByDayIndex';
import FluidsByMonthIndex from './2019-08-25-FluidsByMonthIndex';
import FluidsByYearIndex from './2019-08-25-FluidsByYearIndex';
import FluidTotalsIndex from './2019-08-25-FluidTotalsIndex';
import InspectionsByDayIndex from './2019-08-24-InspectionsByDayIndex';
import EquipmentUsageLogIndex from './2019-08-19-EquipmentUsageLogIndex';
import EquipmentUsageLogIndex0831 from './2019-08-31-EquipmentUsageLogIndex';
import RolesPatchManufacturer from './2019-08-20-RolesPatchManufacturer';
import PatchEquipmentExpectedUsage from './2019-08-21-PatchEquipmentExpectedUsage';
import MigrateAssets from './2019-08-31-MigrateAssets';
import EquipmentUsageLogByDay from './2019-09-05-EquipmentUsageLogByDayIndex';
import DealerSearch from './2019-09-09-DealerSearchIndex';
import DealerContact from './2019-09-13-DealerContactIndex';
import PatchSales from './2019-09-13-PatchSalesServiceParts';
import Location from './2019-10-22-OfficeLocationIndex';
import SeedClassifications from './2019-11-03-SeedClassifications';
import EquipmentManufacturers from './2019-11-02-EquipmentManufacturers';
import InspectionTemplateClassifications from './2019-11-02-InspectionTemplatesClassifications';
import CaseManufacturer from './2019-11-02-CaseManufacturer';
import Classifications from './2019-11-02-Classifications';
import Jobs from './2019-11-10-JobsIndex';
import SeedRolePermissionsRolePermission from './2019-11-15-SeedRolePermissionsRolePermission';
import RolePermissionsIndex from './2019-11-15-RolePermissionsIndex';
import NotificationsIndex from './2020-01-23-NotificationsIndex';
import NotificationsPermission from './2019-12-19-NotificationsPermission';
import SeedExportPerm from './2019-12-25-SeedExportPerm';
import WorkOrdersIndex from './2019-12-25-WorkOrdersIndex';
import PatchWorkEntry from './2020-01-17-PatchWorkEntry';
import PatchInspectionTemplates from './2020-01-23-PatchInspectionTemplates';

export default {
  [UsersIndex.name]: UsersIndex,
  [RolesIndex.name]: RolesIndex,
  [ClientsIndex.name]: ClientsIndex,
  [SeedAdminUsers.name]: SeedAdminUsers,
  [DealersIndex.name]: DealersIndex,
  [InspectionIndex.name]: InspectionIndex,
  [InspectionTemplatesIndex.name]: InspectionTemplatesIndex,
  [ServiceIntervalsIndex.name]: ServiceIntervalsIndex,
  [ManufacturersIndex.name]: ManufacturersIndex,
  [PaymentPlansIndex.name]: PaymentPlansIndex,
  [EquipmentIndex.name]: EquipmentIndex,
  [WorkOrdersIndex.name]: WorkOrdersIndex,
  [FluidReportsIndex.name]: FluidReportsIndex,
  [FluidReportPermissions.name]: FluidReportPermissions,
  [InspectionsPermissions.name]: InspectionsPermissions,
  [PatchIsDefaultStatuses.name]: PatchIsDefaultStatuses,
  [PatchInspectionType.name]: PatchInspectionType,
  [PatchWorkOrdersEnum.name]: PatchWorkOrdersEnum,
  [PatchEquipmentMeter.name]: PatchEquipmentMeter,
  [PatchEquipmentMeterInspections.name]: PatchEquipmentMeterInspections,
  [PatchEquipmentServiceInterval.name]: PatchEquipmentServiceInterval,
  [PatchEquipmentMeterValueManual.name]: PatchEquipmentMeterValueManual,
  [FluidsByDayIndex.name]: FluidsByDayIndex,
  [InspectionsByDayIndex.name]: InspectionsByDayIndex,
  [EquipmentUsageLogIndex.name]: EquipmentUsageLogIndex,
  [RolesPatchManufacturer.name]: RolesPatchManufacturer,
  [PatchEquipmentExpectedUsage.name]: PatchEquipmentExpectedUsage,
  [FluidsByMonthIndex.name]: FluidsByMonthIndex,
  [FluidsByYearIndex.name]: FluidsByYearIndex,
  [FluidTotalsIndex.name]: FluidTotalsIndex,
  [InspectionIndex0831.name]: InspectionIndex0831,
  [FluidReportsIndex0831.name]: FluidReportsIndex0831,
  [EquipmentUsageLogIndex0831.name]: EquipmentUsageLogIndex0831,
  [MigrateAssets.name]: MigrateAssets,
  [EquipmentUsageLogByDay.name]: EquipmentUsageLogByDay,
  [DealerSearch.name]: DealerSearch,
  [DealerContact.name]: DealerContact,
  [PatchSales.name]: PatchSales,
  [Location.name]: Location,
  [UsersIndex1021.name]: UsersIndex1021,
  [SeedClassifications.name]: SeedClassifications,
  [EquipmentManufacturers.name]: EquipmentManufacturers,
  [InspectionTemplateClassifications.name]: InspectionTemplateClassifications,
  [CaseManufacturer.name]: CaseManufacturer,
  [Classifications.name]: Classifications,
  [Jobs.name]: Jobs,
  [SeedRolePermissionsRolePermission.name]: SeedRolePermissionsRolePermission,
  [RolePermissionsIndex.name]: RolePermissionsIndex,
  [NotificationsIndex.name]: NotificationsIndex,
  [NotificationsPermission.name]: NotificationsPermission,
  [SeedExportPerm.name]: SeedExportPerm,
  [WorkOrdersIndex.name]: WorkOrdersIndex,
  [PatchWorkEntry.name]: PatchWorkEntry,
  [PatchInspectionTemplates.name]: PatchInspectionTemplates
};
