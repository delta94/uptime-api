import { Context } from '@/helpers/interfaces';
import { Roles, verifyAccess, formatSearchTerm } from '@/helpers/utils';
import { QueryStatistics } from 'ravendb';
import { RoleTypeEnum } from '@/types/Enums';
import { Resolver, Query, Args, Arg, Ctx, Mutation } from 'type-graphql';
import { TablePaginationWithSearchTextArgs } from '@/types/TablePaginationWithSearchTextArgs';
import { JobReference } from '@/types/job/JobReference';
import { SearchTextClientIdForSelectionArgs } from '@/types/common/SearchTextClientIdForSelectionArgs';
import { Job } from '@/types/job/Job';
import { JobInput } from '@/types/job/JobInput';
import { JobTableList } from '@/types/job/JobTableList';
import { IdNameReference } from '@/types/common/IdNameReference';
import { LogEntry } from '@/types/logEntry/LogEntry';
import { UserReference } from '@/types/user/UserReference';

@Resolver()
export class JobResolver {
  //#region Queries

  @Query(() => JobTableList)
  async jobs(@Args() { skip, pageSize, searchText }: TablePaginationWithSearchTextArgs, @Ctx() { session, req }: Context): Promise<JobTableList> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);

    let stats: QueryStatistics;
    const jobs = session
      .query<Job>({ indexName: 'Jobs' })
      .orderBy('name')
      .statistics(s => (stats = s))
      .skip(skip)
      .take(pageSize);

    if (searchText) {
      jobs.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
    }

    if (searchText) {
      jobs.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
      if (req.user.clientId) {
        jobs.andAlso().whereEquals('clientId', req.user.clientId);
      }
    } else if (req.user.clientId) {
      jobs.whereEquals('clientId', req.user.clientId);
    }

    // if (req.user && req.user.clientId) {
    //   jobs.whereEquals('type', 'Client');
    // }

    return { jobs: await jobs.all(), totalRows: stats.totalResults };
  }

  @Query(() => Job)
  async jobById(@Arg('id') id: string, @Ctx() { session }: Context): Promise<Job> {
    const job = await session.load<Job>(id);
    return job;
  }

  //#endregion

  //#region Mutations

  @Mutation(() => [JobReference])
  async findJobsForSelect(@Args() { searchText, clientId }: SearchTextClientIdForSelectionArgs, @Ctx() { session }: Context): Promise<JobReference[]> {
    // verifyAccess(req, [
    //   { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
    //   { role: Roles.Client, roleType: RoleTypeEnum.Client },
    //   { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    // ]);

    return session
      .query<Job>({ indexName: 'Jobs' })
      .orderByDescending('name')
      .search('name', formatSearchTerm(searchText.split(' ')), 'AND')
      .andAlso()
      .whereEquals('clientId', clientId)
      .selectFields<JobReference>(['id', 'name', 'jobNumber'])
      .take(15)
      .all();
  }

  @Mutation(() => Job)
  async saveJob(@Arg('data') data: JobInput, @Ctx() { session, req }: Context): Promise<Job> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
      { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    ]);

    try {
      const entity = await Job.fromJobInput(session, data);
      if (!data.client && req.user.clientId) entity.client = await IdNameReference.clientFromJwtUser(session, req.user);

      await session.store<Job>(entity);
      await session.saveChanges();
      return entity;
    } catch (ex) {
      await session.store(
        new LogEntry(
          'Resolvers > JobResolver > saveJob',
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
}
