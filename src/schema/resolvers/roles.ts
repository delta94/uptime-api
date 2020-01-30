import { Context } from '@/helpers/interfaces';
import { Roles, verifyAccess, formatSearchTerm } from '@/helpers/utils';
import { QueryStatistics } from 'ravendb';
import { RoleTypeEnum } from '@/types/Enums';
import { Resolver, Query, Args, Arg, Ctx, Mutation } from 'type-graphql';
import { TablePaginationWithSearchTextArgs } from '@/types/TablePaginationWithSearchTextArgs';
import { RoleTableList } from '@/types/role/RoleTableList';
import { Role } from '@/types/role/Role';
import { AvailablePermission } from '@/types/role/AvailablePermission';
import { RolePermissionsAppSettings } from '@/types/appSettings/RolePermissionsAppSettings';
import { AppSettings } from '@/types/appSettings/AppSettings';
import { RoleInput } from '@/types/role/RoleInput';
import { Permission } from '@/types/role/Permission';
import { User } from '@/types/user/User';
import { TablePaginationUser } from '@/types/TablePaginationUser';
import { clone, sortBy } from 'lodash';
import { RolePermissionsByType } from '@/types/appSettings/RolePermissionsByType';
import { RolePermissionsByTypeAppSettings } from '@/types/appSettings/RolePermissionsByTypeAppSettings';
import { RolePermissionsByTypeInput } from '@/types/appSettings/RolePermissionsByTypeInput';
import { RolePermission } from '@/types/role/RolePermission';
import { RolePermissionTableList } from '@/types/role/RolePermissionTableList';

@Resolver()
export class RoleResolver {
  //#region Queries

  @Query(() => RoleTableList)
  async roles(@Args() { skip, pageSize, searchText }: TablePaginationWithSearchTextArgs, @Ctx() { session, req }: Context): Promise<RoleTableList> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);

    let stats: QueryStatistics;
    const roleQuery = session
      .query<Role>({ indexName: 'Roles' })
      .orderBy('name')
      .statistics(s => (stats = s))
      .skip(skip)
      .take(pageSize);

    if (searchText) {
      roleQuery.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
    }

    if (req.user && req.user.clientId) {
      roleQuery.whereEquals('type', 'Client');
    }

    return { roles: await roleQuery.all(), totalRows: stats.totalResults };
  }

  @Query(() => RoleTableList)
  async availableRoles(@Args() { skip, pageSize, searchText, userId }: TablePaginationUser, @Ctx() { session, req }: Context): Promise<RoleTableList> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);

    let stats: QueryStatistics;
    const roleQuery = session
      .query<Role>({ indexName: 'Roles' })
      .orderBy('name')
      .statistics(s => (stats = s))
      .skip(skip)
      .take(pageSize);

    if (searchText) {
      roleQuery.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
    }

    if (req.user && req.user.clientId) {
      roleQuery.whereEquals('type', 'Client');
    }

    const roles = await roleQuery.all();
    if (userId) {
      const usr = await session.load<User>(userId);
      usr.roles.forEach(usrRole => {
        const role = roles.find(x => x.id === usrRole.id);
        if (role) {
          // console.log('role=',role.id);
          // console.log('changing', usrRole.permissions);
          role.permissions = sortBy(role.permissions, p => p.name);
        }
      });
    }

    return { roles, totalRows: stats.totalResults };
  }

  @Query(() => Role)
  async roleById(@Arg('id') id: string, @Ctx() { session, req }: Context): Promise<Role> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);

    const role = await session.load<Role>(id);
    return role;
  }

  @Query(() => [Role])
  async rolesByType(@Arg('type') type: RoleTypeEnum, @Ctx() { session, req }: Context): Promise<Role[]> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);

    return session
      .query<Role>({ indexName: 'Roles' })
      .whereEquals('type', type)
      .all();
  }

  @Query(() => [AvailablePermission])
  async availablePermissions(@Ctx() { session, req }: Context): Promise<AvailablePermission[]> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);
    const rolePermissions = await (<RolePermissionsAppSettings>(<unknown>session.load<AppSettings>('AppSettings/RolePermissions')));
    return rolePermissions.data;
  }

  //#endregion

  //#region Mutations

  @Mutation(() => Role)
  async saveRole(@Arg('data', () => RoleInput) data: RoleInput, @Ctx() { store, session, req }: Context): Promise<Role> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);

    const entity = await Role.fromRoleInput(store, session, data);
    await session.store<Role>(entity);
    await session.saveChanges();
    return entity;
  }

  @Query(() => RolePermissionsByType)
  async saveRolePermissionsByType(
    @Arg('data', () => RolePermissionsByTypeInput) data: RolePermissionsByTypeInput,
    @Ctx() { session, req }: Context
  ): Promise<RolePermissionsByType> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);
    const rolePermissions = await (<RolePermissionsByTypeAppSettings>(<unknown>session.load<AppSettings>('AppSettings/RolePermissionsByType')));
    rolePermissions.data = RolePermissionsByType.fromRolePermissionsByTypeInput(data);
    await session.saveChanges();
    return rolePermissions.data;
  }

  //#endregion
}
