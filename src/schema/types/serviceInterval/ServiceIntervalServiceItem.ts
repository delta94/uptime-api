import { Field, ObjectType, InputType } from 'type-graphql';
import { ServiceIntervalServiceItemInput } from './ServiceIntervalServiceItemInput';

@ObjectType()
export class ServiceIntervalServiceItem {
  static fromServiceIntervalServiceItem(data: ServiceIntervalServiceItemInput) {
    let serviceIntervalMilestone: ServiceIntervalServiceItem;
    serviceIntervalMilestone = new this(data.name, data.partName, data.partNumber);
    return serviceIntervalMilestone;
  }

  @Field()
  public name: string;

  @Field({ defaultValue: '' })
  public partName: string;

  @Field({ defaultValue: '' })
  public partNumber: string;

  @Field({ nullable: true })
  public id?: string;

  @Field({ nullable: true })
  public fromMilestoneId?: string;

  @Field({ nullable: true }) // flag to be used on front side for fast finding witch one to add to new milestones. 
  public isNew?: boolean;

  constructor(name: string, partName: string, partNumber: string) {
    this.name = name;
    this.partName = partName;
    this.partNumber = partNumber;
  }
}
