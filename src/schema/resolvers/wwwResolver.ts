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
import { clone, sortBy } from 'lodash';
import { RolePermissionsByType } from '@/types/appSettings/RolePermissionsByType';
import { RolePermissionsByTypeAppSettings } from '@/types/appSettings/RolePermissionsByTypeAppSettings';
import { RolePermissionsByTypeInput } from '@/types/appSettings/RolePermissionsByTypeInput';
import { RolePermission } from '@/types/role/RolePermission';
import { RolePermissionTableList } from '@/types/role/RolePermissionTableList';
import { ContactFormInput } from '@/types/contactForm/ContactFormInput';
import { ContactForm } from '@/types/contactForm/ContactForm';
import { sendContactFormNotification } from '@/helpers/notificationsHelper';

@Resolver()
export class WwwResolver {
  //#region Queries

  //#endregion

  //#region Mutations

  @Mutation(() => ContactForm)
  async saveContactForm(@Arg('data', () => ContactFormInput) data: ContactFormInput, @Ctx() { store, session, req }: Context): Promise<ContactForm> {
    const entity = await ContactForm.fromContactFormInput(session, data);
    await session.store<ContactForm>(entity);
    await session.saveChanges();
    await sendContactFormNotification(entity);
    return entity;
  }

  //#endregion
}
