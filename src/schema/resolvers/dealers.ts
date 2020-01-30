import { Context } from '@/helpers/interfaces';
import { Roles, verifyAccess, formatSearchTerm, checkDealerContact } from '@/helpers/utils';
import { QueryStatistics } from 'ravendb';
import { Resolver, Query, Args, Arg, Ctx, Mutation } from 'type-graphql';
import { TablePaginationWithSearchTextArgs } from '@/types/TablePaginationWithSearchTextArgs';
import { DealerTableList } from '@/types/dealer/DealerTableList';
import { Dealer } from '@/types/dealer/Dealer';
import { DealerInput } from '@/types/dealer/DealerInput';
import { RoleTypeEnum } from '@/types/Enums';
import { DealerContact } from '@/types/dealerContact/DealerContact';
import { DealerContactTableList } from '@/types/dealerContact/DealerContactTableList';
import { DealerContactInput } from '@/types/dealerContact/DealerContactInput';
import { DealerContactArgs } from '@/types/dealerContact/DealerContactArgs';

@Resolver()
export class DealerResolver {
  //#region Queries

  @Query(() => DealerTableList)
  async dealers(@Args() { skip, pageSize, searchText }: TablePaginationWithSearchTextArgs, @Ctx() { session, req }: Context): Promise<DealerTableList> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    ]);

    let stats: QueryStatistics;
    const dealerQuery = session
      .query<Dealer>({ indexName: 'Dealers' })
      .statistics((s: QueryStatistics) => (stats = s))
      .orderByDescending('updatedOn')
      .skip(skip)
      .take(pageSize);

    if (searchText) {
      dealerQuery.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
      if (req.user.clientId) {
        dealerQuery.andAlso().whereEquals('clientId', req.user.clientId);
      }
    } else if (req.user.clientId) {
      dealerQuery.whereEquals('clientId', req.user.clientId);
    }

    return { dealers: await dealerQuery.all(), totalRows: stats.totalResults };
  }

  @Query(() => DealerTableList)
  async dealersSearch(@Args() { skip, pageSize, searchText }: TablePaginationWithSearchTextArgs, @Ctx() { session, req }: Context): Promise<DealerTableList> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    ]);

    let stats: QueryStatistics;
    const dealerQuery = session
      .query<Dealer>({ indexName: 'DealersSearch' })
      .statistics((s: QueryStatistics) => (stats = s))
      .orderByDescending('updatedOn')
      .skip(skip)
      .take(pageSize);

    if (searchText) {
      dealerQuery.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
      if (req.user.clientId) {
        dealerQuery.andAlso().whereEquals('clientId', req.user.clientId);
      }
    } else if (req.user.clientId) {
      dealerQuery.whereEquals('clientId', req.user.clientId);
    }

    return { dealers: await dealerQuery.all(), totalRows: stats.totalResults };
  }

  @Query(() => DealerContactTableList)
  async dealersContact(@Args() { skip, pageSize, searchText, type }: DealerContactArgs, @Ctx() { session, req }: Context): Promise<DealerContactTableList> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    ]);

    let stats: QueryStatistics;
    const q = session
      .query<DealerContact>({ indexName: 'DealersContact' })
      .statistics((s: QueryStatistics) => (stats = s))
      .whereEquals('representativeType', type)
      .orderByDescending('updatedOn')
      .skip(skip)
      .take(pageSize);

    if (searchText) {
      q.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
      if (req.user.clientId) {
        q.andAlso().whereEquals('clientId', req.user.clientId);
      }
    } else if (req.user.clientId) {
      q.whereEquals('clientId', req.user.clientId);
    }

    return { dealers: await q.all(), totalRows: stats.totalResults };
  }

  @Query(() => Dealer)
  async dealerById(@Arg('id') id: string, @Ctx() { session, req }: Context): Promise<Dealer> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    ]);

    return session.load<Dealer>(id);
  }

  //#endregion

  //#region Mutations

  @Mutation(() => Dealer)
  async saveDealer(@Arg('data', () => DealerInput) data: DealerInput, @Ctx() { session, req }: Context): Promise<Dealer> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    ]);

    const entity = await Dealer.fromDealerInput(session, data, req.user!);
    await session.store<Dealer>(entity);
    await session.saveChanges();
    return entity;
  }

  @Mutation(() => DealerContact)
  async saveDealerContact(@Arg('data', () => DealerContactInput) data: DealerContactInput, @Ctx() { session, req }: Context): Promise<DealerContact> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    ]);

    if (data.email) await checkDealerContact(data.email, session);

    const entity = await DealerContact.fromDealerContactInput(session, data, req.user!);
    await session.store<DealerContact>(entity);
    await session.saveChanges();
    return entity;
  }

  //#endregion
}
