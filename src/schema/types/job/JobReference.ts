import { ObjectType, Field, ID } from 'type-graphql';
import { Job } from './Job';

@ObjectType()
export class JobReference {
  static fromJob(data: Job) {
    return new this(data.id, data.name, data.jobNumber);
  }

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
