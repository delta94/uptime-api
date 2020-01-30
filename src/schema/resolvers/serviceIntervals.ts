import { Context } from '@/helpers/interfaces';
import { QueryStatistics } from 'ravendb';
import { Resolver, Query, Args, Ctx, Arg, Mutation } from 'type-graphql';
import { TablePaginationWithSearchTextArgs } from '@/types/TablePaginationWithSearchTextArgs';
import { ServiceIntervalTableList } from '@/types/serviceInterval/ServiceIntervalTableList';
import { ServiceInterval } from '@/types/serviceInterval/ServiceInterval';
import { ServiceIntervalInput } from '@/types/serviceInterval/ServiceIntervalInput';
import { verifyAccess, Roles, formatSearchTerm } from '@/helpers/utils';
import { RoleTypeEnum } from '@/types/Enums';
import { ServiceIntervalForSelectionArgs } from '@/types/serviceInterval/ServiceIntervalForSelectionArgs';
import { IdTitleReference } from '@/types/common/IdTitleReference';
import { IdNameReference } from '@/types/common/IdNameReference';

@Resolver()
export class ServiceIntervalResolver {
  //#region Queries

  @Query(() => ServiceIntervalTableList)
  async serviceIntervals(
    @Args() { skip, pageSize, searchText }: TablePaginationWithSearchTextArgs,
    @Ctx() { session, req }: Context
  ): Promise<ServiceIntervalTableList> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    ]);

    let stats: QueryStatistics;
    const query = session
      .query<ServiceInterval>({ indexName: 'ServiceIntervals' })
      .statistics((s: QueryStatistics) => (stats = s))
      .orderByDescending('updatedOn')
      .skip(skip)
      .take(pageSize);

    if (searchText) {
      query.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
      if (req.user.clientId) {
        query.andAlso().whereEquals('clientId', req.user.clientId);
      }
    } else if (req.user.clientId) {
      query.whereEquals('clientId', req.user.clientId);
    }

    return { serviceIntervals: await query.all(), totalRows: stats.totalResults };
  }

  @Query(() => ServiceInterval)
  async serviceIntervalById(@Arg('id') id: string, @Ctx() { session }: Context): Promise<ServiceInterval> {
    // verifyAccess(req, [Roles.Administrator]);
    return session.load<ServiceInterval>(id);
  }

  //#endregion

  //#region Mutations

  @Mutation(() => [IdTitleReference])
  async findServiceIntervals(@Args() { searchText, clientId }: ServiceIntervalForSelectionArgs, @Ctx() { session, req }: Context): Promise<IdTitleReference[]> {
    // verifyAccess(req, [
    //   { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
    //   { role: Roles.Client, roleType: RoleTypeEnum.Client },
    //   { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    // ]);

    return session
      .query<ServiceInterval>({ indexName: 'ServiceIntervals' })
      .orderByDescending('title')
      .search('title', formatSearchTerm(searchText.split(' ')), 'AND')
      .andAlso()
      .whereEquals('clientId', clientId)
      .selectFields<IdTitleReference>(['id', 'title'])
      .take(15)
      .all();
  }

  @Mutation(() => ServiceInterval)
  async saveServiceInterval(@Arg('data') data: ServiceIntervalInput, @Ctx() { session, req }: Context): Promise<ServiceInterval> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    ]);

    const entity = await ServiceInterval.fromServiceIntervalInput(session, data);
    if (!data.client && req.user.clientId) entity.client = await IdNameReference.clientFromJwtUser(session, req.user);

    await session.store<ServiceInterval>(entity);
    await session.saveChanges();
    return entity;
  }

  //#endregion
}
