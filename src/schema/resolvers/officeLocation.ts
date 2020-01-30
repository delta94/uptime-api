import { Context } from '@/helpers/interfaces';
import { Roles, verifyAccess, formatSearchTerm } from '@/helpers/utils';
import { QueryStatistics } from 'ravendb';
import { Resolver, Query, Args, Arg, Ctx, Mutation } from 'type-graphql';
import { RoleTypeEnum } from '@/types/Enums';
import { OfficeLocationTableList } from '@/types/officeLocation/OfficeLocationTableList';
import { OfficeLocation } from '@/types/officeLocation/OfficeLocation';
import { TablePaginationWithSearchTextArgs } from '@/types/TablePaginationWithSearchTextArgs';
import { OfficeLocationInput } from '@/types/officeLocation/OfficeLocationInput';
import { Client } from '@/types/client/Client';
import { IdNameReference } from '@/types/common/IdNameReference';
import { SearchTextClientIdForSelectionArgs } from '@/types/common/SearchTextClientIdForSelectionArgs';
import { OfficeLocationReference } from '@/types/officeLocation/OfficeLocationReference';

@Resolver()
export class OfficeLocationsResolver {
  //#region Queries

  @Query(() => OfficeLocationTableList)
  async officeLocations(
    @Args() { skip, pageSize, searchText, id }: TablePaginationWithSearchTextArgs,
    @Ctx() { session, req }: Context
  ): Promise<OfficeLocationTableList> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    ]);

    let stats: QueryStatistics;
    const q = session
      .query<OfficeLocation>({ indexName: 'OfficeLocations' })
      .statistics((s: QueryStatistics) => (stats = s))
      .orderByDescending('updatedOn')
      .skip(skip)
      .take(pageSize);

    if (searchText) {
      q.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
      if (id) {
        q.andAlso().whereEquals('clientId', id);
      } else if (req.user.clientId) {
        q.andAlso().whereEquals('clientId', req.user.clientId);
      }
    } else if (id) {
      q.whereEquals('clientId', id);
    } else if (req.user.clientId) {
      q.whereEquals('clientId', req.user.clientId);
    }

    return { officeLocations: await q.all(), totalRows: stats.totalResults };
  }

  @Query(() => OfficeLocation)
  async officeLocationById(@Arg('id') id: string, @Ctx() { session, req }: Context): Promise<OfficeLocation> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }, { role: Roles.Client, roleType: RoleTypeEnum.Client }]);
    return session.load<OfficeLocation>(id);
  }
  //#endregion

  //#region Mutations

  @Mutation(() => [IdNameReference])
  async findOfficeLocationsForSelect(
    @Args() { searchText, clientId }: SearchTextClientIdForSelectionArgs,
    @Ctx() { session, req }: Context
  ): Promise<IdNameReference[]> {
    // verifyAccess(req, [
    //   { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
    //   { role: Roles.Client, roleType: RoleTypeEnum.Client },
    //   { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    // ]);

    return session
      .query<OfficeLocation>({ indexName: 'OfficeLocations' })
      .orderByDescending('name')
      .search('name', formatSearchTerm(searchText.split(' ')), 'AND')
      .andAlso()
      .whereEquals('clientId', clientId)
      .selectFields<IdNameReference>(['id', 'name'])
      .take(15)
      .all();
  }

  @Mutation(() => [OfficeLocationReference])
  async findOfficeLocationsReference(
    @Args() { searchText, clientId }: SearchTextClientIdForSelectionArgs,
    @Ctx() { session, req }: Context
  ): Promise<OfficeLocationReference[]> {    

    return session
      .query<OfficeLocation>({ indexName: 'OfficeLocations' })
      .orderByDescending('name')
      .search('name', formatSearchTerm(searchText.split(' ')), 'AND')
      .andAlso()
      .whereEquals('clientId', clientId)
      .selectFields<OfficeLocationReference>(['id', 'name', 'client', 'notificationUsers'])
      .take(15)
      .all();
  }

  @Mutation(() => OfficeLocation)
  async saveOfficeLocation(@Arg('data', () => OfficeLocationInput) data: OfficeLocationInput, @Ctx() { session, req }: Context): Promise<OfficeLocation> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    ]);

    const entity = await OfficeLocation.fromOfficeLocationInput(session, data);

    if (data.client) {
      entity.client = data.client;
    } else if (req.user.clientId) {
      entity.client = IdNameReference.fromIdAndNameType(await session.load<Client>(req.user.clientId));
    }

    await session.store<OfficeLocation>(entity);
    await session.saveChanges();
    return entity;
  }

  //#endregion
}
