import { AbstractIndexCreationTask } from 'ravendb';
export class Inspections extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from inspection in docs.Inspections
select new
{
  Query = new
  {
    inspectionEquipmentName = inspection.equipment.name,
    inspectionEquipmentMeterType = inspection.equipment.meterType,
    inspection.meterValue,
    whoFirstName = inspection.who.firstName,
    whoLastName = inspection.who.lastName,
    inspection.type

  },
  inspection.type,
  assetId = inspection.asset.id,
  inspection.title,
  inspection.updatedOn,
  inspection.createdOn,
  inspection.meterValue,
  clientId = inspection.client.id,
  inspection.completed,
  inspection.who,
  whoId = inspection.who.id,
  equipmentId = inspection.equipment.id
}`;
  }
}

export class InspectionTemplates extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from inspectionTemplates in docs.InspectionTemplates
    select new
    {
        Query = new
        {
          inspectionTemplates.title,
          inspectionTemplates.type,
          inspectionTemplates.equipmentType
        },
        inspectionTemplates.title,
        inspectionTemplates.updatedOn,
        inspectionTemplates.classification,
        clientId = inspectionTemplates.client.id ?? false
      }`;
  }
}
