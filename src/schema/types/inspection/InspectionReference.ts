import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class InspectionReference {
  @Field(() => ID)
  public readonly id: string;

  @Field(() => String)
  inspectionChecklistId: string;

  @Field()
  title: string;

  constructor(id: string, inspectionChecklistId: string, title: string) {
    this.id = id;
    this.inspectionChecklistId = inspectionChecklistId;
    this.title = title;
  }
}
