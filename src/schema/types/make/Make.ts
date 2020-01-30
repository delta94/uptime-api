import { DateTime } from 'luxon';
import { IDocumentSession } from 'ravendb';
import { ObjectType, Field, ID } from 'type-graphql';
import { MakeModel } from './MakeModel';
import { capitalizeEachFirstLetter } from '@/helpers/utils';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class Make {
  static async fromMake(session: IDocumentSession, data: Make) {
    let make: Make;
    const { id, createdOn, updatedOn, ...rest } = data;
    if (data.id) {
      make = await session.load(data.id);
    } else {
      make = new this(capitalizeEachFirstLetter(data.name), data.models);
      make.createdOn = DateTime.utc().toJSDate();
    }
    Object.assign(make, { ...rest, updatedOn: DateTime.utc().toJSDate() });
    return make;
  }

  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  @Field()
  public name: string;

  @Field(() => [MakeModel], { nullable: true })
  public models?: MakeModel[];

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  updatedOn?: Date;

  constructor(name: string, models: MakeModel[]) {
    this.name = name;
    this.models = models;
  }
}
