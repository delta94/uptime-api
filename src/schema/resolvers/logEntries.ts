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
import { clone } from 'lodash';
import { LogEntryInput } from '@/types/logEntry/LogEntryInput';
import { LogEntry } from '@/types/logEntry/LogEntry';
import { UserReference } from '@/types/user/UserReference';

@Resolver()
export class LogEntryResolver {
  //#region Queries

  @Query(() => RoleTableList)
  async logEntries(@Args() { skip, pageSize, searchText }: TablePaginationWithSearchTextArgs, @Ctx() { session, req }: Context): Promise<RoleTableList> {
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

  //#endregion

  //#region Mutations

  @Mutation(() => Boolean)
  async saveLogEntry(@Arg('data', () => LogEntryInput) data: LogEntryInput, @Ctx() { session, req }: Context): Promise<boolean> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Administrator, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    ]);
    const entity = await LogEntry.fromLogEntryInput(session, data, req.user);

    await session.store(entity);
    await session.saveChanges();
    return true;
  }

  //#endregion
}
