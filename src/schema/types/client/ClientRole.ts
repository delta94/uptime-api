import { Field, ObjectType, InputType } from 'type-graphql';
import { RoleReference } from '../role/RoleReference';
@ObjectType()
export class ClientRole {
  static fromClientRole(data: ClientRole) {
    return new this(data.id, data.role);
  }

  @Field()
  public id: string;

  @Field()
  public role: RoleReference;

  constructor(id: string, role: RoleReference) {
    this.id = id;
    this.role = role;
  }
}
