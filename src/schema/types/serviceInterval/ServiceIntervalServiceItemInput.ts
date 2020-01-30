import { Field, ObjectType, InputType } from 'type-graphql';

@InputType()
export class ServiceIntervalServiceItemInput {
  @Field()
  public name: string;

  @Field({ nullable: true, defaultValue: '' })
  public partName: string;

  @Field({ nullable: true, defaultValue: '' })
  public partNumber: string;

  @Field({ nullable: true })
  public id?: string;

  @Field({ nullable: true })
  public fromMilestoneId?: string;
}
