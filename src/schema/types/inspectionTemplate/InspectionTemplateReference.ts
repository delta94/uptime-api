import { ObjectType, Field } from 'type-graphql';
import { InspectionTemplate } from './InspectionTemplate';

@ObjectType()
export class InspectionTemplateReference {
  static fromInspectionTemplate(data: InspectionTemplate) {
    return new this(data.id, data.title);
  }

  @Field()
  id: string;

  @Field()
  title: string;

  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }
}
