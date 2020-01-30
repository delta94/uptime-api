import { Context } from '@/helpers/interfaces';
import { Roles, verifyAccess, formatSearchTerm } from '@/helpers/utils';
import { QueryStatistics } from 'ravendb';
import { RoleTypeEnum } from '@/types/Enums';
import { Resolver, Query, Args, Arg, Ctx, Mutation } from 'type-graphql';
import { TablePaginationWithSearchTextArgs } from '@/types/TablePaginationWithSearchTextArgs';
import { RoleInput } from '@/types/role/RoleInput';
import { RolePermission } from '@/types/role/RolePermission';
import { RolePermissionTableList } from '@/types/role/RolePermissionTableList';
import { RolePermissionInput } from '@/types/role/RolePermissionInput';

@Resolver()
export class RolePermissionResolver {
  //#region Queries

  @Query(() => RolePermissionTableList)
  async rolePermissions(@Args() { skip, pageSize, searchText }: TablePaginationWithSearchTextArgs, @Ctx() { session, req }: Context): Promise<RolePermissionTableList> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);

    let stats: QueryStatistics;
    const roleQuery = session
      .query<RolePermission>({ indexName: 'RolePermissions' })
      .orderBy('type')
      .orderBy('name')
      .statistics(s => (stats = s))
      .skip(skip)
      .take(pageSize);

    if (searchText) {
      roleQuery.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
    }

    return { rolePermissions: await roleQuery.all(), totalRows: stats.totalResults };
  }

  @Query(() => RolePermission)
  async rolePermissionById(@Arg('id') id: string, @Ctx() { session, req }: Context): Promise<RolePermission> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);

    const role = await session.load<RolePermission>(id);
    return role;
  }

  @Query(() => [RolePermission])
  async rolePermissionsForAssignment(@Ctx() { session, req }: Context): Promise<RolePermission[]> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);
    return session
      .query<RolePermission>({ collection: 'RolePermissions' })
      .all();
  }

  //#endregion

  //#region Mutations

  @Mutation(() => RolePermission)
  async saveRolePermission(@Arg('data', () => RolePermissionInput) data: RolePermissionInput, @Ctx() { session, req }: Context): Promise<RolePermission> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);

    const entity = await RolePermission.fromRolePermissionInput(session, data);
    await session.store<RolePermission>(entity);
    await session.saveChanges();
    return entity;
  }

  //#endregion
}
