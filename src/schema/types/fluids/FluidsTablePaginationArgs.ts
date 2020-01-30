import { Field, ArgsType } from 'type-graphql';
import { TablePaginationWithSearchTextArgs } from '../TablePaginationWithSearchTextArgs';
@ArgsType()
export class FluidsTablePaginationArgs extends TablePaginationWithSearchTextArgs {
  @Field({ nullable: true })
  from?: Date;

  @Field({ nullable: true })
  to?: Date;
}
