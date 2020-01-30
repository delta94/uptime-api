import { Field, ArgsType, Int } from 'type-graphql';
import { TablePaginationArgs } from './TablePaginationArgs';
import { Filter } from './Filter';
@ArgsType()
export class TablePaginationWithSearchFilterArgs extends TablePaginationArgs {
  @Field({ nullable: true })
  searchText?: string;

  @Field(() => Filter, { nullable: true })
  filter?: Filter;

  @Field({ nullable: true })
  id?: string;
}
