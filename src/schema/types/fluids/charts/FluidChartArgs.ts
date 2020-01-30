import { Field, Int, ArgsType } from 'type-graphql';

@ArgsType()
export class FluidChartArgs {
  @Field({ nullable: true })
  dateFrom?: Date;

  @Field({ nullable: true })
  dateTo?: Date;

  @Field(type => [String], { nullable: true })
  selectedFluids?: string[];
}
