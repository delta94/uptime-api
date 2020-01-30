import { DateTime } from 'luxon';
import { IDocumentSession } from 'ravendb';
import { Field, ObjectType, ID } from 'type-graphql';
import { UserRoleReference } from '../role/UserRoleReference';
import { Address } from '../client/Address';
import { Phone } from '../client/Phone';
import { UserInput } from './UserInput';
import { UserReference } from './UserReference';
import { MobileDevice } from './MobileDevice';
import { JwtUser } from '../JwtUser';
import { UserAgreement } from './UserAgreement';
import { OfficeLocationReference } from '../officeLocation/OfficeLocationReference';
import { capitalizeEachFirstLetter } from '@/helpers/utils';
import { IdNameReference } from '../common/IdNameReference';
import { RoleTypeEnum } from '../Enums';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class User {
  static async fromUserInput(session: IDocumentSession, data: UserInput) {
    let user: User;
    const { id, createdOn, updatedOn, rolesIds, clientId, phones, ...rest } = data;
    if (data.id) {
      user = await session.load(data.id);
    } else {
      user = new this(
        data.publicId,
        capitalizeEachFirstLetter(data.firstName),
        capitalizeEachFirstLetter(data.lastName),
        data.email.toLowerCase(),
        data.active,
        data.password,
        data.roles
      );
      user.createdOn = DateTime.utc().toJSDate();
    }

    // check for duplicate phone...

    Object.assign(user, {
      ...rest,
      updatedOn: DateTime.utc().toJSDate(),
      phones:
        phones && phones.length
          ? phones.map(phone => {
              phone.digits = phone.digits.replace(/\D/g, '');
              return phone;
            })
          : [],
    });
    return user;
  }

  static async fromUserInputAccount(session: IDocumentSession, data: UserInput) {
    let user: User;
    const { id, createdOn, updatedOn, rolesIds, roles, clientId, ...rest } = data;
    if (data.id) {
      user = await session.load(data.id);
    } else {
      user = new this(data.publicId, data.firstName, data.lastName, data.email, data.active);
      user.createdOn = DateTime.utc().toJSDate();
    }
    Object.assign(user, {
      ...rest,
      updatedOn: DateTime.utc().toJSDate(),
    });
    return user;
  }

  static async fromJwtUser(session: IDocumentSession, jwtUser: JwtUser) {
    return session.load<User>(jwtUser.id);
  }

  @Field({ nullable: true })
  public publicId?: string;

  @Field()
  public firstName: string;

  @Field()
  public lastName: string;

  @Field({ nullable: true, defaultValue: '' })
  public email: string;

  @Field()
  public password: string;

  @Field()
  public active: boolean;

  @Field(() => [UserRoleReference])
  public roles?: UserRoleReference[];

  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  @Field({ nullable: true })
  public middleName?: string;

  @Field({ nullable: true })
  public avatarUrl?: string;

  @Field(() => IdNameReference, { nullable: true })
  public client?: IdNameReference;

  @Field(() => [OfficeLocationReference], { nullable: true, defaultValue: [] })
  public officeLocations?: OfficeLocationReference[];

  @Field(() => [Address], { nullable: true })
  public addresses?: Address[];

  @Field(() => [Phone], { nullable: true })
  public phones?: Phone[];

  @Field({ nullable: true })
  public supervisor?: UserReference;

  @Field(() => [MobileDevice], { nullable: true })
  public mobileDevices?: MobileDevice[];

  @Field(() => [UserAgreement], { nullable: true })
  public agreements?: UserAgreement[];

  @Field()
  public timezone: string;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: DateTime.utc().toJSDate() })
  updatedOn?: Date;

  @Field(() => String)
  name(): string {
    return this.name();
  }

  constructor(
    publicId: string,
    firstName: string,
    lastName: string,
    email: string,
    active: boolean,
    password?: string,
    roles?: UserRoleReference[],
    client?: IdNameReference
  ) {
    this.publicId = publicId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.active = active;
    this.password = password;
    this.roles = roles;
    this.client = client;
  }
}
