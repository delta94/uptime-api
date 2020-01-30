import { AbstractIndexCreationTask } from 'ravendb';
export class EquipmentUsageLog extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from equipmentUsageLog in docs.EquipmentUsageLogs
select new
{
  equipmentUsageLog.actualUsage,
  equipmentUsageLog.type,
  clientId = equipmentUsageLog.client.id,
  whoId = equipmentUsageLog.who.id,
  assetId = equipmentUsageLog.asset.id,
  equipmentId = equipmentUsageLog.equipment.id,
  equipmentUsageLog.updatedOn,
  equipmentUsageLog.createdOn
}`;
  }
}
