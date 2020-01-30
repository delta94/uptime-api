import { AbstractIndexCreationTask } from 'ravendb';
class OfficeLocations extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from officeLocation in docs.OfficeLocations
select new
{
  Query = new
  {
    officeLocation.name,
    officeLocation.addresses,
    officeLocation.phones
  },
  officeLocation.name,
  clientId = officeLocation.client.id,
  officeLocation.createdOn,
  officeLocation.updatedOn
}`;
  }
}

export { OfficeLocations };
