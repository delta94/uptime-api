import { ObjectType, Field, Int } from 'type-graphql';
import { Make } from './Make';
@ObjectType()
export class MakeTableList {
  @Field(() => [Make])
  public makes: Make[];

  @Field(() => Int)
  public totalRows: number;
}
