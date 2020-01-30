import { ObjectType, Field } from 'type-graphql';
import { RoleTypeEnum } from '../Enums';
import { AvailablePermissionInput } from './AvailablePermissionInput';
import { getShortUuid, capitalizeEachFirstLetter } from '@/helpers/utils';

@ObjectType()
export class AvailablePermission {
  static fromAvailablePermission(data: AvailablePermission) {
    return new this(data.name, data.type, data.privileges);
  }

  static fromAvailablePermissionInput(data: AvailablePermissionInput): AvailablePermission {
    return new this(
      capitalizeEachFirstLetter(data.name),
      data.type,
      data.privileges.map(p => capitalizeEachFirstLetter(p))
    );
  }

  @Field()
  public name: string;

  @Field()
  public type: RoleTypeEnum;

  @Field(() => [String!])
  public privileges: string[];

  @Field({ defaultValue: getShortUuid() })
  public id: string;

  constructor(name: string, type: RoleTypeEnum, privileges: string[]) {
    this.name = name;
    this.type = type;
    this.privileges = privileges;
  }
}
