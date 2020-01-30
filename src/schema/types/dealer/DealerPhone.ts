import { Field, ObjectType, InputType } from 'type-graphql';
import { PhoneTypeEnum } from '../Enums';
@ObjectType()
export class DealerPhone {
  static fromPhone(data: DealerPhone) {
    return new this(data.type, data.digits);
  }

  @Field(() => PhoneTypeEnum, { nullable: true })
  public type?: PhoneTypeEnum;

  @Field({ nullable: true })
  public digits?: string;

  @Field({ nullable: true })
  public extension?: string;

  constructor(type: PhoneTypeEnum, digits: string) {
    this.type = type;
    this.digits = digits;
  }
}
