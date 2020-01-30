import { AbstractIndexCreationTask } from 'ravendb';

// tslint:disable-next-line: class-name
class EquipmentUsageLogByDay extends AbstractIndexCreationTask {
  public constructor() {
    super();

    this.map = `from equipmentUsageLog in docs.EquipmentUsageLogs
    select new {
     actualUsage = equipmentUsageLog.actualUsage,
     estimateUsage = equipmentUsageLog.estimateUsage,
     equipmentUsageLog.type,
      clientId = equipmentUsageLog.client.id,
      equipmentId = equipmentUsageLog.equipment.id,
      updatedOn = equipmentUsageLog.updatedOn.Date,
      count = 1
    }`;

    this.reduce = `from m in mapped
    group m by new { m.updatedOn,m.equipmentId, m.clientId  } into g
    select new {
      actualUsage = g.Sum(x=>x.actualUsage),
      estimateUsage = g.Select(x=>x.estimateUsage),
      type = g.Select(x=>x.type),
      clientId = g.Key.clientId,
      equipmentId = g.Key.equipmentId,
      updatedOn = g.Key.updatedOn,
      count = g.Sum( x => x.count)
    }`;

    this.outputReduceToCollection = 'EquipmentUsageLog/Day';
  }
}

export { EquipmentUsageLogByDay };
