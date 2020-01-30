import { Field, ObjectType } from 'type-graphql';
@ObjectType()
export class Fluid {
  @Field()
  name: string;
}
