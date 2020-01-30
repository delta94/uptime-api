import { Field, ObjectType, Int } from 'type-graphql';
import { InspectionTemplate } from './InspectionTemplate';

@ObjectType()
export class InspectionTemplateTableList {
  @Field(() => [InspectionTemplate])
  public inspectionTemplates: InspectionTemplate[];

  @Field(() => Int)
  public totalRows: number;
}
