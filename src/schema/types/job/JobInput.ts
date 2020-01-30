import { InputType, Field, ID } from 'type-graphql';
import { AddressInput } from '../client/AddressInput';
import { UserReferenceInput } from '../user/UserReferenceInput';
import { EquipmentReferenceInput } from '../equipment/EquipmentReferenceInput';
import { IdNameReferenceInput } from '../common/IdNameReferenceInput';
import { DetailedEquipmentReferenceInput } from '../equipment/DetailedEquipmentReferenceInput';
import { OfficeLocationReferenceInput } from '../officeLocation/OfficeLocationReferenceInput';
import { IsoDateTime } from 'schema/scalars/date';

@InputType()
export class JobInput {
  @Field()
  public jobNumber: string;

  @Field()
  public name: string;

  @Field(() => IdNameReferenceInput)
  public client: IdNameReferenceInput;

  @Field(() => IdNameReferenceInput)
  public officeLocation: IdNameReferenceInput;

  @Field(() => UserReferenceInput)
  public foreman: UserReferenceInput;

  @Field(() => [AddressInput!])
  public addresses: AddressInput[];

  @Field(() => [DetailedEquipmentReferenceInput!])
  public equipment: DetailedEquipmentReferenceInput[];

  @Field(() => [UserReferenceInput!])
  public operators: UserReferenceInput[];

  @Field(() => [UserReferenceInput!])
  public mechanics: UserReferenceInput[];

  @Field(() => [UserReferenceInput!], { nullable: true, defaultValue: [] })
  public notificationUsers?: UserReferenceInput[];

  @Field(() => IsoDateTime, { nullable: true })
  public startDate?: Date;

  @Field(() => IsoDateTime, { nullable: true })
  public endDate?: Date;

  @Field(() => ID, { nullable: true })
  public readonly id?: string;
}
