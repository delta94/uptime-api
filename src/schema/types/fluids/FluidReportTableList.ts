import { ObjectType, Field, Int } from 'type-graphql';
import { FluidReport } from './FluidReport';
@ObjectType()
export class FluidReportTableList {
  @Field(() => [FluidReport])
  fluidReports: FluidReport[];

  @Field(() => Int)
  totalRows: number;
}
