import { IDocumentSession } from 'ravendb';
import { Field, ObjectType, ID } from 'type-graphql';
import { ServiceIntervalInput } from './ServiceIntervalInput';
import { ServiceIntervalMilestone } from './ServiceIntervalMilestone';
import { getNowUtc, capitalizeEachFirstLetter, capitalize } from '@/helpers/utils';
import { IdNameReference } from '../common/IdNameReference';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class ServiceInterval {
  static async fromServiceIntervalInput(session: IDocumentSession, data: ServiceIntervalInput) {
    let serviceInterval: ServiceInterval;
    const { id, ...rest } = data;
    if (data.id) {
      serviceInterval = await session.load<ServiceInterval>(data.id);
    } else {
      serviceInterval = new this(data.title, data.client, data.milestones);
      serviceInterval.createdOn = getNowUtc();
    }
    Object.assign(serviceInterval, { ...rest, updatedOn: getNowUtc() });
    serviceInterval.milestones.forEach(m => {
      m.title = capitalizeEachFirstLetter(m.title, true);
      m.serviceItems.forEach(s => (s.name = capitalizeEachFirstLetter(s.name, true)));
    });
    return serviceInterval;
  }

  @Field(() => ID, { nullable: true })
  readonly id?: string;

  @Field()
  public title: string;

  // @Field()
  // public description: string;

  @Field()
  public meterType: string;

  @Field({ defaultValue: '' })
  public make: string;

  @Field({ defaultValue: '' })
  public model: string;

  @Field(() => [ServiceIntervalMilestone], { nullable: true })
  public milestones?: ServiceIntervalMilestone[];

  @Field(() => IdNameReference, { nullable: true })
  public client?: IdNameReference;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  updatedOn?: Date;

  constructor(title: string, client: IdNameReference, milestones?: ServiceIntervalMilestone[]) {
    this.title = title;
    this.client = client;
    this.milestones = milestones;
  }
}
