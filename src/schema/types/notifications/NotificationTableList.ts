import { Field, ObjectType, Int } from 'type-graphql';
import { Notification } from './Notification';

@ObjectType()
export class NotificationTableList {
  @Field(() => [Notification!])
  notifications: Notification[];

  @Field(() => Int)
  totalRows: number;
}
