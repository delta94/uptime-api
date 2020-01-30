import { InputType, Field, ID } from 'type-graphql';
import { RoleTypeEnum } from '../Enums';

@InputType()
export class RolePermissionInput {
  @Field(() => ID, { nullable: true })
  public id?: string;

  @Field()
  public name: string;

  @Field()
  public type: RoleTypeEnum;

  @Field(() => [String!])
  public privileges: string[];
}
