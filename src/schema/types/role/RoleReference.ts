import { ObjectType, Field } from 'type-graphql';
import { RoleReferenceInput } from './RoleReferenceInput';
@ObjectType()
export class RoleReference {
  static async fromUser(data: RoleReferenceInput) {
    return new this(data.id, data.name, data.permissions);
  }

  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => [String!])
  permissions: string[];
  constructor(id: string, name: string, permissions: string[]) {
    this.id = id;
    this.name = name;
    this.permissions = permissions;
  }
}
