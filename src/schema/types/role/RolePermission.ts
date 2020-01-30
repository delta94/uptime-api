import { ObjectType, Field, ID } from 'type-graphql';
import { RolePermissionInput } from './RolePermissionInput';
import { capitalizeEachFirstLetter, getShortUuid, getNowUtc } from '@/helpers/utils';
import { RoleTypeEnum } from '../Enums';
import { IDocumentSession } from 'ravendb';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class RolePermission {
  static async fromRolePermissionInput(session: IDocumentSession, data: RolePermissionInput) {
    let rolePermission: RolePermission;
    const { id, name, privileges, ...rest } = data;

    if (data.id) {
      rolePermission = await session.load<RolePermission>(data.id);
    } else {
      rolePermission = new this(
        capitalizeEachFirstLetter(data.name),
        data.type,
        data.privileges.map(p => capitalizeEachFirstLetter(p))
      );
      rolePermission.createdOn = getNowUtc();
    }

    Object.assign(rolePermission, {
      ...rest,
      name: capitalizeEachFirstLetter(name),
      privileges: privileges.map(p => capitalizeEachFirstLetter(p)),
      updatedOn: getNowUtc(),
    });

    return rolePermission;
  }

  @Field(() => ID, { defaultValue: getShortUuid() })
  public id: string;

  @Field()
  public name: string;

  @Field()
  public type: RoleTypeEnum;

  @Field(() => [String!])
  public privileges: string[];

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  updatedOn?: Date;

  constructor(name: string, type: RoleTypeEnum, privileges: string[]) {
    this.name = name;
    this.type = type;
    this.privileges = privileges;
  }
}
