import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class IdTitleReferenceInput {
  @Field()
  public id: string;

  @Field(() => ID)
  public title: string;

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }
}
