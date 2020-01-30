import { Field, ObjectType, Int } from 'type-graphql';
import { InspectionTemplateReference } from './InspectionTemplateReference';

@ObjectType()
export class InspectionTemplateForSelectionList {
  @Field(() => [InspectionTemplateReference])
  public inspectionTemplates: InspectionTemplateReference[];

  @Field(() => Int)
  public totalRows: number;
}
