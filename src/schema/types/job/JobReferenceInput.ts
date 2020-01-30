import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class JobReferenceInput {
  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  @Field()
  public jobNumber: string;

  @Field()
  public name: string;

  constructor(id: string, name: string, jobNumber: string) {
    this.id = id;
    this.name = name;
    this.jobNumber = jobNumber;
  }
}
