import { Context } from '@/helpers/interfaces';
import { Roles, verifyAccess } from '@/helpers/utils';
import { Resolver, Arg, Ctx, Mutation } from 'type-graphql';
import { RoleTypeEnum } from '@/types/Enums';

@Resolver()
export class CommonResolver {
  //#region Queries

  @Mutation(() => Boolean)
  async delete(@Arg('id') id: string, @Ctx() { session, req }: Context): Promise<boolean> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);

    await session.delete(id);
    await session.saveChanges();
    return true;
  }

  //#endregion

  //#region Mutations

  //#endregion
}
