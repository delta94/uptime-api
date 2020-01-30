import { AbstractIndexCreationTask } from 'ravendb';
export class Jobs extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from job in docs.Jobs
select new
{
  Query = new
  {
    job.name,
    job.jobNumber,
    officeLocation = job.officeLocation.name,
  },
  job.name,
  job.jobNumber,
  clientId = job.client.id,
  officeLocationId = job.officeLocation.id,
}`;
  }
}
