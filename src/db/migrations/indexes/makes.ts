import { AbstractIndexCreationTask } from 'ravendb';

class Makes extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from makes in docs.Makes
                select new
                {
                  Query = new
                  {
                      makes.name,
                      models = Enumerable.Select(makes.models, model => model.name)
                  },
                  makes.name,
                  models = Enumerable.Select(makes.models, model => model.name),  
                  makes.updatedOn
                }`;
  }
}

export { Makes };
