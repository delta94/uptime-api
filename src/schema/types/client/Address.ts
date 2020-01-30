import { Field, ObjectType, InputType } from 'type-graphql';
import { AddressTypeEnum } from '../Enums';
@ObjectType()
export class Address {
  static fromAddress(data: Address) {
    return new this(data.lineOne, data.city, data.state, data.postalCode, data.country, data.type);
  }

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
  constructor(lineOne: string, city: string, state: string, postalCode: string, country: string, type: AddressTypeEnum) {
    this.lineOne = lineOne;
    this.city = city;
    this.state = state;
    this.postalCode = postalCode;
    this.country = country;
    this.type = type;
  }
}
