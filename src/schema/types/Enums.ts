import { registerEnumType } from 'type-graphql';

export enum WarrantyInfoTypeEnum {
  Hours = 'Hours',
  Years = 'Years',
}
registerEnumType(WarrantyInfoTypeEnum, {
  name: 'WarrantyInfoTypeEnum',
  description: 'Duration Type for Warranty',
});

export enum EquipmentTypeEnum {
  Tracked = 'Tracked',
  Wheeled = 'Wheeled',
  Other = 'Other',
}
registerEnumType(EquipmentTypeEnum, {
  name: 'EquipmentTypeEnum',
  description: 'General Description of Equipment Type',
});

export enum RoleTypeEnum {
  Client = 'Client',
  Corporate = 'Corporate',
  Developer = 'Developer',
}
registerEnumType(RoleTypeEnum, {
  name: 'RoleTypeEnum',
  description: 'The Basic Types of Roles',
});

export enum RoleScopeEnum {
  Global = 'Global',
  Client = 'Client',
}
registerEnumType(RoleScopeEnum, {
  name: 'RoleScopeEnum',
  description: 'Determines if a Role is Global or Client Specific',
});

export enum BillingPeriodEnum {
  Monthly = 'Monthly',
  Annual = 'Annual',
}
registerEnumType(BillingPeriodEnum, {
  name: 'BillingPeriodEnum',
  description: 'Frequency of Billing Period',
});

export enum DiscountTypeEnum {
  Percentage = 'Percentage',
  Fixed = 'Fixed',
}
registerEnumType(DiscountTypeEnum, {
  name: 'DiscountTypeEnum',
  description: 'Type of Discount',
});

export enum ChecklistItemTypeEnum {
  TextInput = 'TextInput',
  NumericInput = 'NumericInput',
  Status = 'Status',
}
registerEnumType(ChecklistItemTypeEnum, {
  name: 'ChecklistItemTypeEnum',
  description: 'Type of Checklist Item to Display',
});

export enum AgreementTypeEnum {
  Eula = 'EULA',
  Terms = 'Terms',
  Privacy = 'Privacy',
}
registerEnumType(AgreementTypeEnum, {
  name: 'AgreementTypeEnum',
  description: 'Which type of Agreement?',
});

export enum StandardChecklistGroupItemEnum {
  Ok = 'OK',
  Monitor = 'Monitor',
  Replace = 'Replace',
}
registerEnumType(StandardChecklistGroupItemEnum, {
  name: 'StandardChecklistGroupItemEnum',
  description: '[DEPRECATED] Group of Statuses',
});

export enum AddressTypeEnum {
  Mailing = 'Mailing',
  Business = 'Business',
  Home = 'Home',
  Other = 'Other',
}
registerEnumType(AddressTypeEnum, {
  name: 'AddressTypeEnum',
  description: 'Type of Address',
});

export enum PhoneTypeEnum {
  Home = 'Home',
  Business = 'Business',
  Fax = 'Fax',
  Mobile = 'Mobile',
  Department = 'Department',
  Other = 'Other',
}
registerEnumType(PhoneTypeEnum, {
  name: 'PhoneTypeEnum',
  description: 'Type of Phone Number',
});

export enum WorkOrderStatusEnum {
  Open = 'Open',
  Assigned = 'Assigned',
  InProgress = 'InProgress',
  Completed = 'Completed',

  AssessingRepair = 'AssessingRepair',
  WaitingForParts = 'WaitingForParts',
}
registerEnumType(WorkOrderStatusEnum, {
  name: 'WorkOrderStatusEnum',
  description: 'Status of a Work Order',
});

export enum WorkItemStatusEnum {
  Open = 'Open',
  AssessingRepair = 'AssessingRepair',
  WaitingForParts = 'WaitingForParts',
  InProgress = 'InProgress',
  Completed = 'Completed',
}
registerEnumType(WorkItemStatusEnum, {
  name: 'WorkItemStatusEnum',
  description: 'Status of a Work Item',
});

export enum DayEnum {
  Mon = 1,
  Tue = 2,
  Wed = 3,
  Thu = 4,
  Fri = 5,
  Sat = 6,
  Sun = 7,
}
registerEnumType(DayEnum, {
  name: 'DayEnum',
  description: 'Day enum used in equipment',
});

export enum NotificationSourceEnum {
  ServiceInterval = 'Service Interval',
  WorkOrder = 'Work Order',
  ProblemReport = 'Problem Report',
  FluidReport = 'Fluid Report',
  Inspection = 'Inspection',
}
registerEnumType(NotificationSourceEnum, {
  name: 'NotificationSourceEnum',
  description: 'What Sparked the Notification',
});

export enum NotificationTypeEnum {
  ServiceInterval = 'Service Interval',
  WorkOrder = 'Work Order',
}
registerEnumType(NotificationTypeEnum, {
  name: 'NotificationTypeEnum',
  description: 'What Type of Notification',
});

export enum ColorsHexEnum {
  Red = '#FF0000',
  Yellow = '#E7B416',
  Green = '#31A449'
}

registerEnumType(ColorsHexEnum, {
  name: 'ColorsHexEnum',
  description: 'Color hex enum used only on server',
});
