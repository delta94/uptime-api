import { Field, ObjectType, InputType } from 'type-graphql';
import { ClientRole } from './ClientRole';

@ObjectType()
export class ClientRoles {
  static fromClientRoles(data: ClientRoles) {
    return new this(data.parentId, data.roles);
  }

  @Field()
  public parentId: string;

  @Field(() => [ClientRole!])
  public roles: ClientRole[];

  constructor(parentId: string, roles: ClientRole[]) {
    this.parentId = parentId;
    this.roles = roles;
  }
}
