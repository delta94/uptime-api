import { ObjectType, Field, Int } from 'type-graphql';
import { Fluid } from '../appSettings/Fluid';
@ObjectType()
export class FluidTableList {
  @Field(() => [Fluid])
  fluids: Fluid[];

  @Field(() => Int)
  totalRows: number;
}
