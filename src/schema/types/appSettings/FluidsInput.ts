import { Field, InputType } from 'type-graphql';
import { FluidInput } from './FluidInput';
@InputType()
export class FluidsInput {
  @Field(() => [FluidInput])
  public data: FluidInput[];
}
