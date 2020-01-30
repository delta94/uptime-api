import { InputType, Field, ID } from 'type-graphql';
import { AddressInput } from '../client/AddressInput';
import { PhoneInput } from '../client/PhoneInput';
import { UserReferenceInput } from '../user/UserReferenceInput';
import { IdNameReferenceInput } from '../common/IdNameReferenceInput';
import { DetailedEquipmentReferenceInput } from '../equipment/DetailedEquipmentReferenceInput';

@InputType()
export class OfficeLocationInput {
  @Field()
  public name: string;

  @Field(() => IdNameReferenceInput, { nullable: true })
  public client?: IdNameReferenceInput;

  @Field({ nullable: true })
  public website?: string;

  @Field({ nullable: true })
  public email?: string;

  @Field(() => UserReferenceInput, { nullable: true })
  administrator?: UserReferenceInput;

  @Field(() => [DetailedEquipmentReferenceInput!], { nullable: true, defaultValue: [] })
  public equipment?: DetailedEquipmentReferenceInput[];

  @Field(() => [AddressInput!], { nullable: true, defaultValue: [] })
  public addresses: AddressInput[];

  @Field(() => [PhoneInput], { nullable: true, defaultValue: [] })
  public phones?: PhoneInput[];

  @Field(() => [UserReferenceInput!], { nullable: true, defaultValue: [] })
  public operators?: UserReferenceInput[];

  @Field(() => [UserReferenceInput!], { nullable: true, defaultValue: [] })
  public mechanics?: UserReferenceInput[];

  @Field(() => [UserReferenceInput!], { nullable: true, defaultValue: [] })
  public notificationUsers?: UserReferenceInput[];

  @Field(() => ID, { nullable: true })
  public readonly id?: string;
}
