import { Field, InputType } from 'type-graphql';
import { UserRoleReferenceInput } from '../role/UserRoleReferenceInput';

@InputType()
export class UserClientRoleReferenceInput {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  classification: string;

  @Field(() => [UserRoleReferenceInput])
  roles: UserRoleReferenceInput[];
}
