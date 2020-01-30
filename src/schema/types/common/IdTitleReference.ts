import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class IdTitleReference {
  static fromIdAndTitleType<T extends { id?: string; name: string }>(data: T): IdTitleReference {
    return new this(data.id, data.name);
  }

  @Field()
  public id: string;

  @Field(() => ID)
  public title: string;

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }
}
