import { InputType, Field } from 'type-graphql';

@InputType()
export class RoleReferenceInput {
  
  @Field()
  id: string;
  
  @Field()
  name: string;
  
  @Field(() => [String!])
  permissions: string[];
}
