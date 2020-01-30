import { Field, ArgsType, Int } from 'type-graphql';
import { TablePaginationWithSearchTextArgs } from './TablePaginationWithSearchTextArgs';
@ArgsType()
export class TablePaginationWorkOrder extends TablePaginationWithSearchTextArgs {
  @Field({ defaultValue: false })
  completed?: boolean;

  @Field({ nullable: true })
  equipmentId?: string;
}
