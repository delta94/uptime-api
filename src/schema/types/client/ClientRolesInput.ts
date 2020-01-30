import { Field, InputType } from 'type-graphql';
import { ClientRoleInput } from './ClientRoleInput';
@InputType()
export class ClientRolesInput {
  @Field()
  public parentId: string;

  @Field(() => [ClientRoleInput!])
  public roles: ClientRoleInput[];
}
