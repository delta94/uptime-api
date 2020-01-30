import { AbstractIndexCreationTask } from 'ravendb';

class Manufacturers extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from manufacturer in docs.Manufacturers
select new
{
  Query = new
  {
      manufacturer.brand,
      models = Enumerable.Select(manufacturer.models, model => model.name)
  },
  manufacturer.brand,
  models = Enumerable.Select(manufacturer.models, model => model.name),
  clientId = manufacturer.client.id,
  manufacturer.updatedOn
}`;
  }
}

export { Manufacturers };
