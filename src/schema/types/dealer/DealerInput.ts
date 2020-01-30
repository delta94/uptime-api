import { InputType, Field, ID } from 'type-graphql';
import { DealerPhoneInput } from './DealerPhoneInput';
import { DealerAddressInput } from './DealerAddressInput';
import { DealerContactInput } from '../dealerContact/DealerContactInput';

@InputType()
export class DealerInput {
  @Field()
  public name: string;

  @Field({ nullable: true })
  public website?: string;

  @Field({ nullable: true })
  public email?: string;

  @Field({ nullable: true })
  public location?: DealerAddressInput;

  @Field(() => [DealerPhoneInput], { nullable: true })
  public phones?: DealerPhoneInput[];

  @Field(() => [DealerContactInput], { nullable: true })
  public sales?: DealerContactInput[];

  @Field(() => [DealerContactInput], { nullable: true })
  public service?: DealerContactInput[];

  // @Field({ nullable: true })
  // public service?: DealerUserReferenceInput;

  // @Field({ nullable: true })
  // public parts?: DealerUserReferenceInput;

  @Field(() => [DealerContactInput], { nullable: true })
  public parts?: DealerContactInput[];

  @Field(() => ID, { nullable: true })
  public readonly id?: string;
}
