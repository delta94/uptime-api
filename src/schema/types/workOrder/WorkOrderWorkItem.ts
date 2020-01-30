import { Field, ObjectType } from 'type-graphql';
import { UserReference } from '../user/UserReference';
import { getNowUtc, getShortUuid } from '@/helpers/utils';
import { WorkOrderHistoryItem } from './WorkOrderHistoryItem';
import { WorkEntry } from './WorkEntry';
import { WorkOrderStatusEnum, WorkItemStatusEnum } from '../Enums';
import { EquipmentPart } from '../equipment/EquipmentPart';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class WorkOrderWorkItem {
  @Field()
  id: string;

  @Field()
  title: string;

  // // This should be filled in if coming from a Service Interval, Service Item that has a partName defined
  // // Otherwise, filled in when the mechanic is completing the work.
  @Field({ nullable: true, defaultValue: '' })
  notes?: string;

  // // This should be filled in if coming from a Service Interval, Service Item that has a partName defined
  // // Otherwise, filled in when the mechanic is completing the work.
  // @Field({ nullable: true })
  // partNumber?: string;

  // @Field(() => [WorkOrderHistoryItem], { defaultValue: [] })
  // history: WorkOrderHistoryItem[];

  // If the problem report or the inspection checklistItem had a photo or photos, include the urls here
  @Field(() => [String], { nullable: true, defaultValue: [] })
  public photos?: string[];

  // Every time the mechanics creates a new WorkTimeEntry, they need to set the current status of this work item
  // So when they click to start, they must set the status, such as: Assessing Repair, or Completed
  @Field(() => WorkItemStatusEnum)
  public status: WorkItemStatusEnum;

  @Field(() => Boolean)
  completed: boolean;

  @Field(() => UserReference, { nullable: true })
  completedBy?: UserReference;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  completedOn: Date;

  // @Field(() => [WorkOrderHistoryItem], { defaultValue: [] })
  // history: WorkOrderHistoryItem[];

  constructor(title: string, photos?: string[], notes?: string) {
    this.id = getShortUuid();
    this.completed = false;
    this.completedOn = getNowUtc(); // Need to set this so that the MetaData is set.
    this.title = title;
    this.photos = photos;
    this.notes = notes;
  }
}
