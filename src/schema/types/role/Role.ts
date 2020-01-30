import { DateTime } from 'luxon';
import { IDocumentSession, IDocumentStore } from 'ravendb';
import deepEqual from 'fast-deep-equal';
import { patchUserRolePermissions } from '@/helpers/patches';
import { ObjectType, Field, ID } from 'type-graphql';
import { RoleTypeEnum, RoleScopeEnum } from '../Enums';
import { RoleInput } from './RoleInput';
import { Permission } from './Permission';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class Role {
  static async fromRoleInput(store: IDocumentStore, session: IDocumentSession, data: RoleInput) {
    let role: Role;
    const { id, ...rest } = data;
    if (data.id) {
      role = await session.load(data.id);
      // if (!deepEqual(role.permissions, data.permissions)) {
      //   await patchUserRolePermissions(store, data);
      // }
    } else {
      role = new this(data.name, data.type, data.scope, data.permissions);
      role.createdOn = DateTime.utc().toJSDate();
    }
    Object.assign(role, { ...rest, updatedOn: DateTime.utc().toJSDate() });

    // Remove all the empty privileged permissions
    const permissionsToKeep: Permission[] = [];
    role.permissions.forEach(p => {
      if (p.privileges.length > 0) permissionsToKeep.push(p);
    });
    role.permissions = permissionsToKeep;

    return role;
  }

  @Field()
  public name: string;

  @Field(() => RoleTypeEnum)
  public type: RoleTypeEnum;

  @Field(() => RoleScopeEnum)
  public scope: RoleScopeEnum;

  @Field(() => [Permission!])
  public permissions: Permission[];

  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  updatedOn?: Date;

  constructor(name: string, type: RoleTypeEnum, scope: RoleScopeEnum, permissions: Permission[]) {
    this.name = name;
    this.type = type;
    this.scope = scope;
    this.permissions = permissions;
  }
}
