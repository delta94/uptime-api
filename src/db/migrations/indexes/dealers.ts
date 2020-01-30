import { AbstractIndexCreationTask } from 'ravendb';
class Dealers extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from dealer in docs.Dealers
select new
{
  Query = new
  {
    dealer.name,
    dealer.website,
    dealer.email,
    dealerCity = dealer.location.city,
    dealerCountry = dealer.location.country
  },
  dealer.name,
  dealer.createdOn,
  dealer.updatedOn,
  clientId = dealer.client.id
}`;
  }
}

export { Dealers };
