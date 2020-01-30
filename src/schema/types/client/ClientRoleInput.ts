import { Field, InputType } from 'type-graphql';
import { RoleReferenceInput } from '../role/RoleReferenceInput';

@InputType()
export class ClientRoleInput {
  @Field()
  public id: string;

  @Field()
  public role: RoleReferenceInput;
}
