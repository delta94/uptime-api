import { Field, ArgsType, Int } from 'type-graphql';
import { TablePaginationArgs } from '../TablePaginationArgs';

@ArgsType()
export class DealerContactArgs extends TablePaginationArgs {
  @Field({ nullable: true })
  searchText?: string;

  @Field()
  type: string;
}
