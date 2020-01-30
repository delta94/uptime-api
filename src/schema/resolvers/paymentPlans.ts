import { Context } from '@/helpers/interfaces';
import { QueryStatistics } from 'ravendb';
import { Resolver, Query, Args, Arg, Ctx, Mutation } from 'type-graphql';
import { PayTableList } from '@/types/paymentPlan/PayTableList';
import { TablePaginationWithSearchTextArgs } from '@/types/TablePaginationWithSearchTextArgs';
import { PaymentPlan } from '@/types/paymentPlan/PaymentPlan';
import { PaymentPlanInput } from '@/types/paymentPlan/PaymentPlanInput';
import { verifyAccess, Roles, formatSearchTerm } from '@/helpers/utils';
import { RoleTypeEnum } from '@/types/Enums';

@Resolver()
export class PaymentPlanResolver {
  //#region Queries

  @Query(() => PayTableList)
  async paymentPlans(@Args() { skip, pageSize, searchText }: TablePaginationWithSearchTextArgs, @Ctx() { session, req }: Context): Promise<PayTableList> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);

    let stats: QueryStatistics;
    const inspectionQuery = session
      .query<PaymentPlan>({ indexName: 'PaymentPlans' })
      .statistics((s: QueryStatistics) => (stats = s))
      .skip(skip)
      .take(pageSize);
    if (searchText) {
      inspectionQuery.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
    }
    return { paymentPlans: await inspectionQuery.all(), totalRows: stats.totalResults };
  }

  @Query(() => PaymentPlan)
  async paymentPlanById(@Arg('id') id: string, @Ctx() { session, req }: Context): Promise<PaymentPlan> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);

    return session.load<PaymentPlan>(id);
  }

  //#endregion

  //#region Mutations

  @Mutation(() => PaymentPlan)
  async savePaymentPlan(@Arg('data', () => PaymentPlanInput) data: PaymentPlanInput, @Ctx() { session, req }: Context): Promise<PaymentPlan> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);

    const entity = await PaymentPlan.fromPaymentPlanInput(session, data);
    await session.store<PaymentPlan>(entity);
    await session.saveChanges();
    return entity;
  }

  //#endregion
}
