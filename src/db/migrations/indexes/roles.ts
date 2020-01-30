import { AbstractIndexCreationTask } from 'ravendb';

class Roles extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from role in docs.Roles
select new
{
    Query = new
    {
        role.name,
        role.type,
        role.permissions,
    },
    role.name,
    role.type,
    role.permissions,
    role.createdOn,
    role.updatedOn
}`;
  }
}

export { Roles };
