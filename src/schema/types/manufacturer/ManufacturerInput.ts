import { InputType, Field, ID } from 'type-graphql';
import { ManufacturerModelInput } from './ManufacturerModelInput';

@InputType()
export class ManufacturerInput {
  @Field()
  public brand: string;

  @Field(() => [ManufacturerModelInput], { nullable: true })
  public models?: ManufacturerModelInput[];

  @Field(() => ID, { nullable: true })
  public readonly id?: string;
}
