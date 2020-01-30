import { AbstractIndexCreationTask } from 'ravendb';

class RolePermissions extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from rolePermission in docs.RolePermissions
select new
{
    Query = new
    {
        rolePermission.name,
        rolePermission.type,
        rolePermission.permissions,
    },
    rolePermission.name,
    rolePermission.type,
    rolePermission.permissions,
    rolePermission.createdOn,
    rolePermission.updatedOn
}`;
  }
}

export { RolePermissions };
