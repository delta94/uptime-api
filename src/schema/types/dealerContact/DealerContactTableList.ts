import { ObjectType, Field, Int } from 'type-graphql';
import { DealerContact } from './DealerContact';
@ObjectType()
export class DealerContactTableList {
  @Field(() => [DealerContact])
  dealers: DealerContact[];

  @Field(() => Int)
  totalRows: number;
}
