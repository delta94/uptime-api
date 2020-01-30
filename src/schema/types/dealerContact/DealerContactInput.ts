import { InputType, Field, ID } from 'type-graphql';
import { DealerPhoneInput } from '../dealer/DealerPhoneInput';

@InputType()
export class DealerContactInput {
  @Field()
  public firstName: string;

  @Field()
  public lastName: string;

  @Field({ nullable: true })
  public email: string;

  @Field(() => DealerPhoneInput, { nullable: true })
  public phone?: DealerPhoneInput;

  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  @Field()
  public representativeType: string;
}
