import { ObjectType, Field, Int } from 'type-graphql';
import { Manufacturer } from './Manufacturer';
@ObjectType()
export class ManufacturerTableList {
  @Field(() => [Manufacturer])
  public manufacturers: Manufacturer[];

  @Field(() => Int)
  public totalRows: number;
}
