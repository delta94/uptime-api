import { Field, ObjectType, InputType, Int } from 'type-graphql';
@ObjectType()
@InputType()
export class AncestryInput {
  @Field(() => Int)
  public depth: number;

  @Field()
  public breadcrumb: string;

  @Field({ nullable: true, defaultValue: [] })
  public ancestors?: string;
}
