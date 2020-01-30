import { Field, ObjectType, InputType } from 'type-graphql';
import { PhoneTypeEnum } from '../Enums';

@InputType()
export class DealerPhoneInput {
  @Field(() => PhoneTypeEnum, { nullable: true })
  public type?: PhoneTypeEnum;

  @Field({ nullable: true })
  public digits?: string;

  @Field({ nullable: true })
  public extension?: string;
}
