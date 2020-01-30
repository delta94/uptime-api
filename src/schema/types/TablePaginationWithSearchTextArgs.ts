import { Field, ArgsType, Int } from 'type-graphql';
import { TablePaginationArgs } from './TablePaginationArgs';
@ArgsType()
export class TablePaginationWithSearchTextArgs extends TablePaginationArgs {
  @Field({ nullable: true })
  searchText?: string;

  @Field({ nullable: true })
  id?: string;
}
