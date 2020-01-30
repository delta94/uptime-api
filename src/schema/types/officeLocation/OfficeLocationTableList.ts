import { ObjectType, Field, Int } from 'type-graphql';
import { OfficeLocation } from './OfficeLocation';

@ObjectType()
export class OfficeLocationTableList {
  @Field(() => [OfficeLocation])
  officeLocations: OfficeLocation[];

  @Field(() => Int)
  totalRows: number;
}
