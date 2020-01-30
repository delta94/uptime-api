import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class NameOnly {
  @Field()
  public name: string;
}
