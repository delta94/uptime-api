import { Field, ObjectType, Int } from 'type-graphql';
import { Client } from './Client';

@ObjectType()
export class ClientTableList {
  @Field(() => [Client!])
  public clients: Client[];

  @Field(() => Int)
  public totalRows: number;
}
