import { ObjectType, Field, Int } from 'type-graphql';
import { Dealer } from './Dealer';
@ObjectType()
export class DealerTableList {
  @Field(() => [Dealer])
  dealers: Dealer[];

  @Field(() => Int)
  totalRows: number;
}
