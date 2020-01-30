import { AbstractIndexCreationTask } from 'ravendb';

class Clients extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from client in docs.Clients
select new
{
    Query = new
    {
      client.uuid,
      client.name,
      client.website,
      client.loginDomain
    },
    client.uuid,
    client.name,
    client.updatedOn
}`;
  }
}

export { Clients };
