import { ObjectType, Field, Int } from 'type-graphql';
import { Classification } from '../appSettings/Classification';
@ObjectType()
export class ClassificationTableList {
  @Field(() => [Classification])
  classifications: Classification[];

  @Field(() => Int)
  totalRows: number;
}
