import { ID, InputType } from 'type-graphql';
import { Field } from 'type-graphql/dist/decorators/Field';

@InputType()
export class ContactFormInput {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  message: string;

  constructor(name: string, email: string, message: string) {
    this.name = name;
    this.email = email;
    this.message = message;
  }
}
