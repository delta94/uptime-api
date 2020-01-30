import { Field, InputType } from 'type-graphql';
@InputType()
export class FluidInput {
  @Field()
  name: string;
}
