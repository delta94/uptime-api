import { InputType, Field } from 'type-graphql';
import { RoleTypeEnum } from '../Enums';
import { getShortUuid } from '@/helpers/utils';

@InputType()
export class AvailablePermissionInput {
  @Field()
  public name: string;

  @Field()
  public type: RoleTypeEnum;

  @Field(() => [String!])
  public privileges: string[];

  @Field({ defaultValue: getShortUuid() })
  public id: string;
}
