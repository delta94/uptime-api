import { InputType, Field, ID } from 'type-graphql';
import { MakeModelInput } from './MakeModelInput';

@InputType()
export class MakeInput {
  @Field()
  public name: string;

  @Field(() => [MakeModelInput], { nullable: true })
  public models?: MakeModelInput[];

  @Field(() => ID, { nullable: true })
  public readonly id?: string;
}
