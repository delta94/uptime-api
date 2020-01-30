import { Field, ArgsType, Int } from 'type-graphql';
import { TablePaginationWithSearchTextArgs } from './TablePaginationWithSearchTextArgs';
@ArgsType()
export class TablePaginationUser extends TablePaginationWithSearchTextArgs {
  @Field({ nullable: true })
  userId?: string;
}
