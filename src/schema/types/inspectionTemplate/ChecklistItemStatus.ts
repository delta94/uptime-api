import { Field, ObjectType, InputType } from 'type-graphql';
@ObjectType()
export class ChecklistItemStatus {
  @Field()
  public text: string;

  @Field()
  public color: string;

  @Field({ nullable: true, defaultValue: false })
  public shouldSendAlert?: boolean;

  @Field({ nullable: true, defaultValue: false })
  public isDefault: boolean;
}
