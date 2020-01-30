import { ObjectType, Field, Int } from 'type-graphql';
import { Job } from './Job';

@ObjectType()
export class JobTableList {
  @Field(() => [Job])
  jobs: Job[];

  @Field(() => Int)
  totalRows: number;
}
