import { ObjectType, Field, Int } from 'type-graphql';
import { Equipment } from './Equipment';

@ObjectType()
export class EquipmentTableList {
  @Field(() => [Equipment])
  public equipment: Equipment[];

  @Field(() => Int)
  public totalRows: number;
}
