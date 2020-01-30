import { Context } from '@/helpers/interfaces';
import { formatSearchTerm, verifyAccess, Roles } from '@/helpers/utils';
import { QueryStatistics } from 'ravendb';
import { Resolver, Query, Args, Arg, Ctx, Mutation } from 'type-graphql';
import { TablePaginationWithSearchTextArgs } from '@/types/TablePaginationWithSearchTextArgs';
import { ClientTableList } from '@/types/client/ClientTableList';
import { Client } from '@/types/client/Client';
import { ClientInput } from '@/types/client/ClientInput';
import { RoleTypeEnum } from '@/types/Enums';
import { SearchTextArgs } from '@/types/common/SearchTextArgs';
import { IdNameReference } from '@/types/common/IdNameReference';
import { IdNameReferenceInput } from '@/types/common/IdNameReferenceInput';

@Resolver()
export class ClientResolver {
  //#region Queries

  @Query(() => ClientTableList)
  async clients(@Args() { skip, pageSize, searchText }: TablePaginationWithSearchTextArgs, @Ctx() { session, req }: Context): Promise<ClientTableList> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);

    // hack for preventing a client to see other clients
    if (req.user.clientId) {
      const client = await session.load<Client>(req.user.clientId);
      return { clients: client ? [client] : [], totalRows: client ? 1 : 0 };
    } else {
      let stats: QueryStatistics;
      const clientQuery = session
        .query<Client>({ indexName: 'Clients' })
        .statistics(s => (stats = s))
        .orderByDescending('updatedOn')
        .skip(skip)
        .take(pageSize);

      if (searchText) {
        clientQuery.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
      }

      return { clients: await clientQuery.all(), totalRows: stats.totalResults };
    }
  }

  @Query(() => Client)
  async clientById(@Arg('id') id: string, @Ctx() { session, req }: Context): Promise<Client> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);

    return session.load<Client>(id);
  }

  //#endregion

  //#region Mutations

  @Mutation(() => [IdNameReference])
  async clientsForSelection(@Args() { searchText }: SearchTextArgs, @Ctx() { session, req }: Context): Promise<IdNameReference[]> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);

    // hack for preventing a client to see other clients
    // if (req.user.clientId) {
    //   const client = await session.load<Client>(req.user.clientId);
    //   return client ? [IdNameReference.fromIdAndNameType(client)] : [];
    // } else {
    const clientQuery = session
      .query<Client>({ indexName: 'Clients' })
      .orderByDescending('updatedOn')
      .take(15);

    if (searchText) {
      clientQuery.search('name', formatSearchTerm(searchText.split(' ')), 'AND');
    }

    const clients = await clientQuery.all();
    return IdNameReference.fromIdAndNameTypes(clients);
    // }
  }

  @Mutation(() => Client)
  async saveClient(@Arg('data') data: ClientInput, @Ctx() { session, req }: Context): Promise<Client> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);

    const entity = await Client.fromClientInput(session, data);
    await session.store<Client>(entity);
    await session.saveChanges();
    return entity;
  }

  //#endregion
}
