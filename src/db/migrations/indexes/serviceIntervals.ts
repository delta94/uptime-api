import { AbstractIndexCreationTask } from 'ravendb';
export class ServiceIntervals extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from serviceInterval in docs.ServiceIntervals
select new
{
  Query = new
  {
    serviceInterval.operatingHours,
    serviceInterval.title,
  },
  serviceInterval.operatingHours,
  serviceInterval.initialService,
  serviceInterval.serviceList,
  serviceInterval.title,
  serviceInterval.updatedOn,
  clientId = serviceInterval.client.id
}`;
  }
}
