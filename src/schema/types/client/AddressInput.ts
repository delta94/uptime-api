import { Field, ObjectType, InputType } from 'type-graphql';
import { AddressTypeEnum } from '../Enums';
@InputType()
export class AddressInput {
  @Field()
  public lineOne: string;

  @Field()
  public city: string;

  @Field()
  public state: string;

  @Field()
  public postalCode: string;

  @Field()
  public country: string;

  @Field(() => AddressTypeEnum)
  public type: AddressTypeEnum;

  @Field({ nullable: true })
  public lineTwo?: string;

  @Field({ nullable: true })
  public lineThree?: string;
}
