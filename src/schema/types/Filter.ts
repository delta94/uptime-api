import { ObjectType, Field, ArgsType, InputType } from 'type-graphql';

@InputType()
export class Filter {
  @Field({ nullable: true })
  filters?: string;
}
