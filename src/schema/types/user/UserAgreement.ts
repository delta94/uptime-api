import { Field, ObjectType } from 'type-graphql';
import { DateTime } from 'luxon';
import { AgreementTypeEnum } from '../Enums';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class UserAgreement {
  @Field()
  public type: AgreementTypeEnum;

  @Field()
  public version: number;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  constructor(type: AgreementTypeEnum, version: number) {
    this.type = type;
    this.version = version;
    this.createdOn = DateTime.utc().toJSDate();
  }
}
