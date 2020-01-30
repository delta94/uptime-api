import { InputType, Field, ID } from 'type-graphql';
import { RoleTypeEnum } from '../Enums';
import { getShortUuid } from '@/helpers/utils';

@InputType()
export class PermissionInput {
  @Field()
  public name: string;

  @Field(() => RoleTypeEnum)
  public type: RoleTypeEnum;

  @Field(() => [String])
  public privileges: string[];

  @Field(() => ID, { nullable: true })
  public id: string = getShortUuid();
}
