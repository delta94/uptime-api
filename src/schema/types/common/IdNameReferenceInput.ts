import { Field, ID, InputType } from 'type-graphql';
import { IdNameReference } from './IdNameReference';

@InputType()
export class IdNameReferenceInput {
  @Field()
  public name: string;

  @Field(() => ID)
  public id: string;

  constructor(id: string, name: string) {
    this.name = name;
    this.id = id;
  }
}
