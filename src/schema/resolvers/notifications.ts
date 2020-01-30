import { Context } from '@/helpers/interfaces';
import { QueryStatistics } from 'ravendb';
import { Resolver, Query, Args, Ctx, Arg, Mutation } from 'type-graphql';
import { TablePaginationWithSearchTextArgs } from '@/types/TablePaginationWithSearchTextArgs';
import { MakeTableList } from '@/types/make/MakeTableList';
import { Make } from '@/types/make/Make';
import { MakeInput } from '@/types/make/MakeInput';
import { verifyAccess, Roles, formatSearchTerm, isMakeUnique as checkMake } from '@/helpers/utils';
import { RoleTypeEnum } from '@/types/Enums';
import { SearchTextArgs } from '@/types/common/SearchTextArgs';
import { MakeModelSearchTextArgs } from '@/types/make/MakeModelSearchTextArgs';
import { sortBy, find } from 'lodash';
import { NotificationTableList } from '@/types/notifications/NotificationTableList';
import { Notification } from '@/types/notifications/Notification';
import { UserReference } from '@/types/user/UserReference';
import { DateTime } from 'luxon';

@Resolver()
export class NotificationResolver {
  //#region Queries

  @Query(() => NotificationTableList)
  async notifications(
    @Args() { skip, pageSize, searchText }: TablePaginationWithSearchTextArgs,
    @Ctx() { session, req }: Context
  ): Promise<NotificationTableList> {
    // verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    let stats: QueryStatistics;
    const q = session
      .query<Notification>({ indexName: 'Notifications' })
      .statistics((s: QueryStatistics) => (stats = s))
      .orderByDescending('updatedOn')      
      .whereEquals('alertedUserId', req.user.id)
      .skip(skip)
      .take(pageSize);

    // if (searchText) {
    //   q.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
    //   if (req.user.clientId) {
    //     q.andAlso().whereEquals('clientId', req.user.clientId);
    //   }
    // } else if (req.user.clientId) {
    //   q.whereEquals('clientId', req.user.clientId);
    // }
    if (searchText) {
      q.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
    }
    return { notifications: await q.all(), totalRows: stats.totalResults };
  }

  @Query(() => Notification)
  async notificationById(@Arg('id') id: string, @Ctx() { session }: Context): Promise<Notification> {
    const notification = await session.load<Notification>(id);    
    notification.viewedOn = DateTime.utc().toJSDate();
    session.saveChanges();    
    return notification;
  }

  //#endregion

  //#region Mutations

  @Mutation(() => Make)
  async saveNotification(@Arg('data', () => MakeInput) data: MakeInput, @Ctx() { session, req }: Context): Promise<Make> {
    // verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    const isEdit = data.id ? true : false;
    if (isEdit) {
      const make = await session.load<Make>(data.id);
      if (make.name !== data.name) {
        // console.log('checking brand');
        await checkMake(data.name, session);
      }
    } else {
      // console.log('checking brand');
      await checkMake(data.name, session);
    }

    const entity = await Make.fromMake(session, data);
    if (!entity.id) {
      // check on insert
      await checkMake(data.name, session);
    }
    await session.store<Make>(entity);
    await session.saveChanges();
    return entity;
  }

  //#endregion
}
