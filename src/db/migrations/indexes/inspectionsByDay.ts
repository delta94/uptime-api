import { AbstractIndexCreationTask } from 'ravendb';

class InspectionsByDay extends AbstractIndexCreationTask {
  public constructor() {
    super();

    this.map = `from inspection in docs.Inspections
select new {
    equipmentId = inspection.equipment.id,
    clientId = inspection.client.id,
    type = inspection.type,
    createdOn = inspection.createdOn.Date,
    meterValueDaily = inspection.meterValueDaily,
    count = 1
}`;

    this.reduce = `from m in mapped
group m by new { m.createdOn, m.equipmentId, m.clientId  } into g
select new {
    type = g.Select(x=>x.type),
    meterValueDaily = g.Sum(x=>x.meterValueDaily),
    equipmentId = g.Key.equipmentId,
    clientId = g.Key.clientId,
    createdOn = g.Key.createdOn,
    count = g.Sum( x => x.count)
}`;

    this.outputReduceToCollection = 'InspectionsByDay';
  }
}

export { InspectionsByDay };
