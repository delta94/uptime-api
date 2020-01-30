import { Field, ObjectType, Int } from 'type-graphql';
import { ServiceInterval } from './ServiceInterval';

@ObjectType()
export class ServiceIntervalTableList {
  @Field(() => [ServiceInterval])
  public serviceIntervals: ServiceInterval[];

  @Field(() => Int)
  public totalRows: number;
}
