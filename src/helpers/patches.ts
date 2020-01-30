import { IndexQuery, PatchByQueryOperation, IDocumentStore } from 'ravendb';
import { Role } from '@/types/role/Role';

export const patchUserRolePermissions = async (store: IDocumentStore, role: Role): Promise<void> => {
  const indexQuery = new IndexQuery();
  indexQuery.waitForNonStaleResults = true;
  indexQuery.query = `from index Users as users
  where users.roleIds = "${role.id}"
  update {
         users.roles.map(role => {
             if( role.id === "${role.id}") {
              role.name = "${role.name}";
              role.type = "${role.type}";
              role.permissions = ${JSON.stringify(role.permissions)};
            }
         })
  }`;
  const patch = new PatchByQueryOperation(indexQuery);
  await store.operations.send(patch);
  // return operation.waitForCompletion();

  // const patchRequest = new PatchRequest();
  // patchRequest.script = `from index Users as users
  // where users.roleIds = "args.role.id"
  // update {
  //        users.roles.map(role => {
  //            if( role.id === "args.role.id") {
  //             role.name = "args.role.name";
  //             role.type = "args.role.type";
  //             role.permissions  = args.role.permissions;
  //           }
  //        })
  // }`;
  // patchRequest.values = { role: role };
  // const patchOperation = new PatchOperation("customTypes/1", null, patchRequest);
  // await store.operations.send(patchOperation);
};
