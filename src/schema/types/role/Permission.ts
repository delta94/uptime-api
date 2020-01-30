import { ObjectType, Field, ID } from 'type-graphql';
import { RoleTypeEnum } from '../Enums';
import { PermissionInput } from './PermissionInput';
import { AvailablePermissionInput } from './AvailablePermissionInput';
import { capitalizeEachFirstLetter, getShortUuid } from '@/helpers/utils';

@ObjectType()
export class Permission {
  static fromPermission(data: PermissionInput) {
    return new this(
      capitalizeEachFirstLetter(data.name),
      data.type,
      data.privileges.map(p => capitalizeEachFirstLetter(p)),
      data.id
    );
  }
  static fromAvailablePermission(data: AvailablePermissionInput, privileges?: string[]) {
    return new this(
      capitalizeEachFirstLetter(data.name),
      data.type,
      privileges ? privileges.map(p => capitalizeEachFirstLetter(p)) : data.privileges.map(p => capitalizeEachFirstLetter(p)),
      data.id
    );
  }

  @Field()
  public name: string;

  @Field(() => RoleTypeEnum)
  public type: RoleTypeEnum;

  @Field(() => [String])
  public privileges: string[];

  @Field(() => ID, { nullable: true })
  public id: string;

  constructor(name: string, type: RoleTypeEnum, privileges: string[], id: string = getShortUuid()) {
    this.name = name;
    this.type = type;
    this.privileges = privileges;
    this.id = id;
  }
}
