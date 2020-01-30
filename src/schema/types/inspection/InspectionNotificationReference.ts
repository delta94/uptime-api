import { Field, ID, ObjectType } from 'type-graphql';
import { IdTitleReference } from '../common/IdTitleReference';

@ObjectType()
export class InspectionNotificationReference {
  @Field(() => ID)
  public readonly id: string;

  @Field(() => [IdTitleReference])
  inspectionChecklists: IdTitleReference[];

  @Field()
  title: string;

  constructor(id: string, inspectionChecklists: IdTitleReference[], title: string) {
    this.id = id;
    this.inspectionChecklists = inspectionChecklists;
    this.title = title;
  }
}
