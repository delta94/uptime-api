import { ID, InputType } from 'type-graphql';
import { Field } from 'type-graphql/dist/decorators/Field';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class LogEntryInput {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field()
  hint: string;

  @Field(() => GraphQLJSON)
  data: any;

  @Field({ nullable: true })
  errorMessage?: string;

  @Field({ nullable: true })
  stackTrace?: string;

  constructor(hint: string, data: any, errorMessage: string = '', stackTrace: string = '') {
    this.hint = hint;
    this.data = data;
    this.errorMessage = errorMessage;
    this.stackTrace = stackTrace;
  }
}
