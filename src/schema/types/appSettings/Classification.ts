import { Field, ObjectType } from 'type-graphql';
@ObjectType()
export class Classification {
  @Field()
  name: string;
}
