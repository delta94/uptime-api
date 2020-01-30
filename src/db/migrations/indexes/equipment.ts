import { AbstractIndexCreationTask } from 'ravendb';

class Equipment extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from equipment in docs.equipment
select new
{
  Query = new
  {
    equipment.name,
    equipment.nickname,
    equipment.meterValue,
    equipment.type,
    equipment.vinOrSerial,
    equipment.year,
    equipmentDealerName = equipment.dealer.name,
    equipment.manufacturer,
    equipment.meterType
  },
  equipment.name,
  equipment.manufacturer,
  equipment.model,
  equipment.updatedOn,
  operatorId = Enumerable.Select(equipment.operators, o => o.id),
  equipment.classification,
  clientId = equipment.client.id,
}`;
  }
}

export { Equipment };
