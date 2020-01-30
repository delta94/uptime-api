import { Field, ID, InputType } from 'type-graphql';
import { IdNameReferenceInput } from '../common/IdNameReferenceInput';
import { UserReferenceInput } from '../user/UserReferenceInput';

@InputType()
export class OfficeLocationReferenceInput {
  @Field()
  public name: string;

  @Field(() => IdNameReferenceInput)
  public client: IdNameReferenceInput;

  @Field(() => ID)
  public id: string;

  @Field(() => [UserReferenceInput!], { nullable: true, defaultValue: [] })
  public notificationUsers?: UserReferenceInput[];

  constructor(id: string, name: string, client: IdNameReferenceInput, notificationUsers: UserReferenceInput[]) {
    this.name = name;
    this.id = id;
    this.client = client;
    this.notificationUsers = notificationUsers;
  }
}
