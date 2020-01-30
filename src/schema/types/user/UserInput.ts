import { DateTime } from 'luxon';
import { Field, InputType, ID } from 'type-graphql';
import { UserRoleReferenceInput } from '../role/UserRoleReferenceInput';
import { AddressInput } from '../client/AddressInput';
import { Address } from 'cluster';
import { PhoneInput } from '../client/PhoneInput';
import { Phone } from '../client/Phone';
import { OfficeLocationReferenceInput } from '../officeLocation/OfficeLocationReferenceInput';
import { IdNameReferenceInput } from '../common/IdNameReferenceInput';
import { IsoDateTime } from 'schema/scalars/date';

@InputType()
export class UserInput {
  @Field({ nullable: true })
  public publicId: string;

  @Field()
  public firstName: string;

  @Field()
  public lastName: string;

  @Field({ nullable: true, defaultValue: '' })
  public email?: string;

  @Field()
  public password: string;

  @Field()
  public timezone: string;

  @Field()
  public active: boolean;

  @Field(() => [UserRoleReferenceInput], { nullable: true })
  public roles?: UserRoleReferenceInput[];

  @Field(() => [String], { nullable: true })
  public rolesIds?: string[];

  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  @Field({ nullable: true })
  public middleName?: string;

  @Field({ nullable: true })
  public avatarUrl?: string;

  @Field(() => IdNameReferenceInput, { nullable: true })
  public client?: IdNameReferenceInput;

  @Field(() => [IdNameReferenceInput], { nullable: true, defaultValue: [] })
  public officeLocations?: OfficeLocationReferenceInput[];

  @Field({ nullable: true })
  clientId?: string;

  @Field(() => [AddressInput], { nullable: true })
  public addresses?: Address[];

  @Field(() => [PhoneInput], { nullable: true })
  public phones?: Phone[];

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  updatedOn?: Date;
}
