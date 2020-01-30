import { Field, ObjectType, Int } from 'type-graphql';
@ObjectType()
export class Ancestry {
  static fromAncestry(data: Ancestry) {
    return new this(data.depth, data.breadcrumb);
  }

  @Field(() => Int)
  public depth: number;

  @Field()
  public breadcrumb: string;

  @Field({ nullable: true, defaultValue: [] })
  public ancestors?: string;

  constructor(depth: number, breadcrumb: string) {
    this.depth = depth;
    this.breadcrumb = breadcrumb;
  }
}
