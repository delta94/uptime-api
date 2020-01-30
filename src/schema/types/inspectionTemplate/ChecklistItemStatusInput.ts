import { Field, ObjectType, InputType } from 'type-graphql';

@InputType()
export class ChecklistItemStatusInput {
  @Field()
  public text: string;

  @Field({ nullable: true, defaultValue: false })
  public shouldSendAlert?: boolean;

  @Field()
  public color: string;

  @Field()
  public isDefault: boolean;
}
