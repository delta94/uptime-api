import { Context } from '@/helpers/interfaces';
import { QueryStatistics } from 'ravendb';
import { Resolver, Args, Ctx, Query, Arg, Mutation } from 'type-graphql';
import { TablePaginationWithSearchTextArgs } from '@/types/TablePaginationWithSearchTextArgs';
import { EquipmentTableList } from '@/types/equipment/EquipmentTableList';
import { Equipment } from '@/types/equipment/Equipment';
import { EquipmentInput } from '@/types/equipment/EquipmentInput';
import { formatSearchTerm, verifyAccess, Roles } from '@/helpers/utils';
import { RoleTypeEnum } from '@/types/Enums';
import { ResponseChartEquipment } from '@/types/equipmentUsageLog/charts/ResponseChartEquipment';
import { EquipmentChartArgs } from '@/types/equipmentUsageLog/charts/EquipmentChartArgs';
import { EquipmentUsageDay } from '@/types/equipmentUsageLog/charts/EquipmentUsageDay';
import moment = require('moment');
import { ClientNameArgs } from '@/types/client/ClientNameArgs';
import { SearchTextArgs } from '@/types/common/SearchTextArgs';
import { MakeModelSearchTextArgs } from '@/types/make/MakeModelSearchTextArgs';
import { LogEntry } from '@/types/logEntry/LogEntry';
import { UserReference } from '@/types/user/UserReference';
import { IdNameReference } from '@/types/common/IdNameReference';
import { DetailedEquipmentReference } from '@/types/equipment/DetailedEquipmentReference';
import { UserByClientIdArgs } from '@/types/user/UserByClientIdArgs';

@Resolver()
export class EquipmentResolver {
  //#region Queries

  @Query(() => EquipmentTableList)
  async equipment(@Args() { skip, pageSize, searchText }: TablePaginationWithSearchTextArgs, @Ctx() { session, req }: Context): Promise<EquipmentTableList> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    let stats: QueryStatistics;
    const equipmentQuery = session
      .query<Equipment>({ indexName: 'Equipment' })
      .statistics((s: QueryStatistics) => (stats = s))
      .orderByDescending('updatedOn')
      .skip(skip)
      .take(pageSize);

    if (searchText) {
      equipmentQuery.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
      if (req.user.clientId) {
        equipmentQuery.andAlso().whereEquals('clientId', req.user.clientId);
      }
    } else if (req.user.clientId) {
      equipmentQuery.whereEquals('clientId', req.user.clientId);
    }

    return { equipment: await equipmentQuery.all(), totalRows: stats.totalResults };
  }

  @Query(() => ResponseChartEquipment)
  async chartEquipmentDay(@Args() { equipmentId }: EquipmentChartArgs, @Ctx() { session, req }: Context): Promise<ResponseChartEquipment> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);
    const q = session
      .query<any>({ indexName: 'EquipmentUsageLogByDay' })
      .whereEquals('equipmentId', equipmentId);

    if (req.user.clientId) {
      q.andAlso().whereEquals('clientId', req.user.clientId);
    }

    const res = (await q.all()).map(item => {
      const day = moment(item.updatedOn).format('MMM D');
      return <EquipmentUsageDay>{
        day: day,
        actualUsage: item.actualUsage,
        estimateUsage: item.estimateUsage[0],
      };
    });

    return { chartData: res };
  }

  //   @Args() { searchText, clientId, role }: UserByClientIdArgs,

  @Query(() => [DetailedEquipmentReference])
  async equipmentForSelect(
    @Args() { searchText, clientId, role }: UserByClientIdArgs,
    @Ctx() { session, req }: Context
  ): Promise<DetailedEquipmentReference[]> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    const q = session
      .query<Equipment>({ indexName: 'Equipment' })
      .whereEquals('clientId', clientId)
      .selectFields<DetailedEquipmentReference>(['id', 'name', 'nickname', 'meterType', 'classification', 'make', 'model', 'vinOrSerial'])
      .take(15);

    if (role) {
      q.andAlso().whereEquals('roles', role);
    }

    if (searchText) {
      q.andAlso().search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
    }

    return q.all();
  }

  @Query(() => EquipmentTableList)
  async myEquipment(@Args() { skip, pageSize, searchText }: TablePaginationWithSearchTextArgs, @Ctx() { session, req }: Context): Promise<EquipmentTableList> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    let stats: QueryStatistics;
    const equipmentQuery = session
      .query<Equipment>({ indexName: 'Equipment' })
      .statistics((s: QueryStatistics) => (stats = s))
      .whereEquals('operatorId', req.user.id)
      .orderByDescending('updatedOn')
      .skip(skip)
      .take(pageSize);

    if (searchText) {
      equipmentQuery.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
      if (req.user.clientId) {
        equipmentQuery.andAlso().whereEquals('clientId', req.user.clientId);
      }
    } else if (req.user.clientId) {
      equipmentQuery.whereEquals('clientId', req.user.clientId);
    }

    return { equipment: await equipmentQuery.all(), totalRows: stats.totalResults };
  }

  @Query(() => Equipment)
  async equipmentById(@Arg('id') id: string, @Ctx() { session }: Context): Promise<Equipment> {
    const equipment = await session.load<Equipment>(id);
    return equipment;
  }

  //#endregion

  //#region Mutations

  @Mutation(() => [String])
  async equipmentNames(@Args() { clientId, name }: ClientNameArgs, @Ctx() { session, req }: Context): Promise<string[]> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    const names = await session
      .query<Equipment>({ indexName: 'Equipment' })
      .orderBy('name')
      .whereEquals('clientId', clientId)
      .whereStartsWith('name', name)
      .selectFields<string>('name')
      .take(15)
      .all();

    return names;
  }

  @Mutation(() => [String])
  async makesForSelect(@Args() { searchText }: SearchTextArgs, @Ctx() { session, req }: Context): Promise<string[]> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    const q = session
      .query<Equipment>({ indexName: 'Equipment' })
      .search('make', formatSearchTerm(searchText.split(' ')), 'AND')
      .orderBy('make')
      .selectFields<string>('make')
      .distinct()
      .take(15);

    return q.all();
  }

  @Mutation(() => [String])
  async modelsForSelect(@Args() { searchText, make }: MakeModelSearchTextArgs, @Ctx() { session, req }: Context): Promise<string[]> {
    // verifyAccess(req, [
    //   { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
    //   { role: Roles.Client, roleType: RoleTypeEnum.Client },
    //   { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    //   { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    // ]);

    return session
      .query<Equipment>({ indexName: 'Equipment' })
      .whereEquals('make', make)
      .andAlso()
      .search('model', formatSearchTerm(searchText.split(' ')), 'AND')
      .orderBy('model')
      .selectFields<string>('model')
      .distinct()
      .take(15)
      .all();
  }

  @Mutation(() => Equipment)
  async saveEquipment(@Arg('data') data: EquipmentInput, @Ctx() { session, req }: Context): Promise<Equipment> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    try {
      const entity = await Equipment.fromEquipmentInput(session, data);
      if (!data.client && req.user.clientId) entity.client = await IdNameReference.clientFromJwtUser(session, req.user);
      // if (data.make) {
      //   const count = await session
      //     .query<Make>({ indexName: 'Makes' })
      //     .whereEquals('brand', data.make)
      //     .count();
      //   if (count === 0) {
      //     // Insert it
      //     const make: MakeInput = {
      //       brand: data.make,
      //     };
      //     const makeEntity = await Make.fromMake(session, make);

      //     session.store<Make>(makeEntity);
      //   }
      // }
      await session.store<Equipment>(entity);
      await session.saveChanges();
      return entity;
    } catch (ex) {
      await session.store(
        new LogEntry(
          'Resolvers > UserResolver > signin',
          data,
          `[EXCEPTION] ${ex.message}`,
          new Error(ex.message).stack,
          await IdNameReference.clientFromJwtUser(session, req.user),
          await UserReference.fromJwtUser(session, req.user)
        )
      );
      await session.saveChanges();
      throw ex;
    }
  }

  //#endregion
}
