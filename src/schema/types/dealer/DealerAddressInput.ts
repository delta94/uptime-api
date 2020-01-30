import { Field, ObjectType, InputType, ID } from 'type-graphql';
import { AddressTypeEnum } from '../Enums';
@InputType()
export class DealerAddressInput {
  @Field(() => ID, { nullable: true })
  public id?: string;

  @Field({ nullable: true })
  public lineOne?: string;

  @Field({ nullable: true })
  public city?: string;

  @Field({ nullable: true })
  public state?: string;

  @Field({ nullable: true })
  public postalCode?: string;

  @Field({ nullable: true })
  public country?: string;

  @Field(() => AddressTypeEnum, { nullable: true })
  public type?: AddressTypeEnum;

  @Field({ nullable: true })
  public lineTwo?: string;

  @Field({ nullable: true })
  public lineThree?: string;
}
