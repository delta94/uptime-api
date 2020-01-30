import { AbstractIndexCreationTask } from 'ravendb';

class WorkOrders extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from workOrder in docs.WorkOrders
select new
{
  Query = new
  {
    workOrder.equipment,
    workOrder.status,
    workOrder.reportedBy.firstName,
    workOrder.reportedBy.lastName,
    workOrder.notes
  },
  workOrder.equipment,
  workOrder.status,
  workOrder.updatedOn,
  clientId = workOrder.client.id,
  equipmentId = workOrder.equipment.id
}`;
  }
}

export { WorkOrders };
