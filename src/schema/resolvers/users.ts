import { Context } from '@/helpers/interfaces';
import { Roles, verifyAccess, formatSearchTerm, checkEmail, getPasswordResetText, getSuccessResetText } from '@/helpers/utils';
import { QueryStatistics } from 'ravendb';
import { RoleTypeEnum, AgreementTypeEnum, NotificationSourceEnum } from '@/types/Enums';
import { Resolver, Query, Ctx, Args, Arg, Mutation, FieldResolver, Root } from 'type-graphql';
import { TablePaginationWithSearchTextArgs } from '@/types/TablePaginationWithSearchTextArgs';
import { DateTime } from 'luxon';
import * as jwt from 'jsonwebtoken';
import { MeResponse } from '@/types/user/MeResponse';
import { User } from '@/types/user/User';
import { LoggedInUser } from '@/types/user/LoggedInUser';
import { UserTableList } from '@/types/user/UserTableList';
import { LoginResponse } from '@/types/user/LoginResponse';
import { LoginArgs } from '@/types/user/LoginArgs';
import { UserInput } from '@/types/user/UserInput';
import { MobileDevice } from '@/types/user/MobileDevice';
import { uniqBy, some } from 'lodash';
import { ForgotPassword } from '@/types/forgotPassword/ForgotPassword';
import { ForgotPasswordInput } from '@/types/forgotPassword/ForgotPasswordInput';
import { ForgotPasswordResponse as StatusResponse } from '@/types/forgotPassword/ForgotPasswordResponse';
import { ResetPasswordInput } from '@/types/forgotPassword/ResetPasswordInput';
import { UserAgreement } from '@/types/user/UserAgreement';
import { UserByClientIdArgs } from '@/types/user/UserByClientIdArgs';
const nodemailer = require('nodemailer');
import * as EmailValidator from 'email-validator';
import { LogEntry } from '@/types/logEntry/LogEntry';
import { UserReference } from '@/types/user/UserReference';
import { IdNameReference } from '@/types/common/IdNameReference';
import { Notification } from '@/types/notifications/Notification';

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'secure.emailsrvr.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'support@uptimepm.com',
    pass: 'umeeZqj9WJcU7@mzcKVi',
  },
});

@Resolver(() => User)
export class UserResolver {
  //#region Queries

  @Query(() => MeResponse || undefined)
  async me(@Ctx() { session, req }: Context): Promise<MeResponse | null> {
    verifyAccess(req);

    const me = await session.load<User>(req.user.id);
    return { user: await LoggedInUser.fromUser(me) };
  }

  @Query(() => UserTableList)
  async users(@Args() { skip, pageSize, searchText }: TablePaginationWithSearchTextArgs, @Ctx() { session, req }: Context): Promise<UserTableList> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
    ]);

    let stats: QueryStatistics;

    const userQuery = session
      .query<User>({ indexName: 'Users' })
      .statistics(s => (stats = s))
      .orderByDescending('updatedOn')
      .skip(skip)
      .take(pageSize);

    if (searchText) {
      userQuery.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
      if (req.user.clientId) {
        userQuery.andAlso().whereEquals('clientId', req.user.clientId);
      }
    } else if (req.user && req.user.clientId && !some(req.user.roles, role => role.type === RoleTypeEnum.Corporate)) {
      userQuery.whereEquals('clientId', req.user.clientId);
    }

    return { users: await userQuery.all(), totalRows: stats.totalResults };
  }

  @Query(() => User)
  async userById(@Arg('id') id: string, @Ctx() { session, req }: Context): Promise<User> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
    ]);
    return session.load<User>(id);
  }

  @Query(() => User)
  async userByEmail(@Arg('email') email: string, @Ctx() { session, req }: Context): Promise<User> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
    ]);
    return session.load<User>(email);
  }

  @Query(() => [User])
  async userByRoleType(@Arg('roleType') roleType: RoleTypeEnum, @Ctx() { session, req }: Context): Promise<User[]> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
    ]);

    return session
      .query<User>({ indexName: 'Users' })
      .whereEquals('roleTypes', roleType)
      .all();
  }

  @Query(() => [User])
  async userByClientId(@Args() { clientId, role, searchText }: UserByClientIdArgs, @Ctx() { session, req }: Context): Promise<User[]> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
    ]);

    const users = session
      .query<User>({ indexName: 'Users' })
      .whereEquals('clientId', clientId);

    if (role) {
      users.andAlso().whereEquals('roles', role);
    }

    if (searchText) {
      users.andAlso().search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
    }
    const result = await users.all();

    // console.log('result.length, clientId, role', result.length, clientId, role);
    return result;
  }

  //#endregion

  //#region Mutations

  @Mutation(() => [UserReference])
  async findUsersForSelect(@Args() { searchText, clientId, role }: UserByClientIdArgs, @Ctx() { session, req }: Context): Promise<UserReference[]> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
    ]);

    const users = session
      .query<User>({ indexName: 'Users' })
      .whereEquals('clientId', clientId)
      .selectFields<UserReference>(['id', 'firstName', 'lastName', 'email'])
      .take(15);

    if (role) {
      users.andAlso().whereEquals('roles', role);
    }

    if (searchText) {
      users.andAlso().search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
    }

    return users.all();
  }

  @Mutation(() => LoginResponse)
  async signin(@Args() { email, password, uuid }: LoginArgs, @Ctx() { session, req }: Context): Promise<LoginResponse> {
    await session.store(
      new LogEntry(
        'Resolvers > UserResolver > signin',
        {
          email,
          password,
          uuid,
        },
        '[TRACE]',
        '',
        null,
        null
      )
    );
    await session.saveChanges();

    const user = await session
      .query<User>({ indexName: 'Users' })
      .whereEquals('active', true)
      .openSubclause()
      .whereEquals('email', email)
      .orElse()
      .whereEquals('phoneNumbers', EmailValidator.validate(email) ? email : email.replace(/\D/g, ''))
      .closeSubclause()
      .firstOrNull();

    if (!user) {
      throw new Error('Email/Phone and/or Password is invalid');
    }

    if (password !== user.password) {
      throw new Error('Email/Phone and/or Password is invalid');
    }

    user.updatedOn = DateTime.utc().toJSDate();
    if (uuid) {
      user.mobileDevices = user.mobileDevices ? uniqBy([...user.mobileDevices, new MobileDevice(uuid)], d => d.deviceId) : [new MobileDevice(uuid)];
    }
    // console.log('user.mobileDevice', user.mobileDevices);

    await session.saveChanges();

    const token = jwt.sign(
      { id: user.id, roles: user.roles, clientId: user.client ? user.client.id : null, timezone: user.timezone },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '18h',
      }
    );

    // Add this for any Restful API Call
    req['user'] = {
      id: user.id,
      roles: user.roles,
      timezone: user.timezone,
    };

    // Get notification number for the user.
    const count = await session
      .query<Notification>({ indexName: 'Notifications' })
      .whereEquals('alertedUserId', user.id)
      .andAlso()
      .not()
      .whereExists('viewedOn')
      .count();

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        timezone: user.timezone,
        roles: user.roles,
        client: user.client,
        notificationCount: count,
      },
      token,
    };
  }

  @Mutation(() => LoginResponse)
  async signinWithBiometrics(@Arg('uuid') uuid: string, @Ctx() { session, req }: Context): Promise<LoginResponse> {
    const user = await session
      .query<User>({ indexName: 'Users' })
      .whereEquals('mobileDeviceIds', uuid)
      .firstOrNull();

    if (!user) {
      throw new Error('Email and/or Password is invalid');
    }

    user.updatedOn = DateTime.utc().toJSDate();
    await session.saveChanges();

    const token = jwt.sign(
      { id: user.id, roles: user.roles, clientId: user.client ? user.client.id : null, timezone: user.timezone },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '18h',
      }
    );

    // Add this for any Restful API Call
    // req['user'] = {
    //   id: user.id,
    //   roles: user.roles,
    // };

    // Get notification number for the user.
    const count = await session
      .query<Notification>({ indexName: 'Notifications' })
      .whereEquals('alertedUserId', user.id)
      .andAlso()
      .whereEquals('notificationSeen', false)
      .andAlso()
      .whereEquals('notificationSource', NotificationSourceEnum.WorkOrder)
      .count();

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        timezone: user.timezone,
        roles: user.roles,
        notificationCount: count,
      },
      token,
    };
  }

  @Mutation(() => User)
  async saveMyAccount(@Arg('data', () => UserInput) data: UserInput, @Ctx() { session, req }: Context): Promise<User> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
    ]);
    if (!data.id) return;
    const loggedInUser = await session.load<User>(req.user.id);
    if (loggedInUser.email !== data.email) {
      // console.log('checking email');
      await checkEmail(data.email, session);
    }

    const entity: User = await User.fromUserInputAccount(session, data);
    if (!data.client && !data.clientId && req.user.clientId) {
      entity.client = await IdNameReference.clientFromJwtUser(session, req.user);
    }

    await session.store<User>(entity);
    await session.saveChanges();
    return entity;
  }

  @Mutation(() => User)
  async saveUser(@Arg('data', () => UserInput) data: UserInput, @Ctx() { session, req }: Context): Promise<User> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
    ]);
    const isEdit = data.id ? true : false;
    if (isEdit) {
      const loggedInUser = await session.load<User>(data.id);
      if (loggedInUser.email !== data.email) {
        // console.log('checking email');
        await checkEmail(data.email, session);
      }
    } else {
      // console.log('checking email');
      await checkEmail(data.email, session);
    }

    const entity: User = await User.fromUserInput(session, data);
    if (!data.client && !data.clientId && req.user.clientId) {
      entity.client = await IdNameReference.clientFromJwtUser(session, req.user);
    }

    await session.store<User>(entity);
    await session.saveChanges();
    return entity;
  }

  @Mutation(() => StatusResponse)
  async forgotPassword(@Arg('data', () => ForgotPasswordInput) data: ForgotPasswordInput, @Ctx() { session, req }: Context): Promise<StatusResponse> {
    const usr = await session
      .query<User>({ indexName: 'Users' })
      .whereEquals('email', data.email)
      .singleOrNull();
    if (usr) {
      const entity: ForgotPassword = await ForgotPassword.fromForgotPasswordInput(usr.id);
      await session.store<ForgotPassword>(entity);
      const expiry = DateTime.utc()
        .plus({ minutes: 15 })
        .toString();
      session.advanced.getMetadataFor(entity)['@expires'] = expiry;
      await session.saveChanges();

      const resetLink = req.headers['origin'] + '/reset-password/' + entity.token;
      const passwordResetText = getPasswordResetText(usr, resetLink);

      const info = await transporter.sendMail({
        from: '"Equipment Uptime" <support@uptimepm.com>', // sender address
        to: usr.email, // list of receivers
        bcc: ['troy@uptimepm.com'],
        subject: '[UptimePM] Reset your password', // Subject line
        // text: passwordResetText, // plain text body
        html: passwordResetText, // html body
      });

      // console.log('Message sent: %s', info.messageId);

      if (info.messageId) return { status: true };
      else return { status: false };
    } else {
      return { status: false };
    }
  }

  @Mutation(() => StatusResponse)
  async resetPassword(@Arg('data', () => ResetPasswordInput) data: ResetPasswordInput, @Ctx() { session, req }: Context): Promise<StatusResponse> {
    const id = 'ForgotPassword/' + data.token;
    const forgotPass = await session.load<ForgotPassword>(id);

    if (forgotPass && data.password === data.confirm) {
      // document exists let's reset usr pass
      const usr = await session.load<User>(forgotPass.userId);
      usr.password = data.password;
      session.delete(forgotPass);
      await session.saveChanges();

      const successResetText = getSuccessResetText(usr);
      const info = await transporter.sendMail({
        from: '"Equipment Uptime" <forbetradev@gmail.com>', // sender address
        to: usr.email, // list of receivers
        bcc: ['troy@uptimepm.com'],
        subject: '[UptimePM] Your password was successfully reset', // Subject line
        // text: passwordResetText, // plain text body
        html: successResetText, // html body
      });

      if (info.messageId) return { status: true };
      else return { status: false };
    } else {
      return { status: false };
    }
  }

  @Mutation(() => StatusResponse)
  async acceptAgreement(
    @Arg('sendEmail', () => Boolean) sendEmail: boolean,
    @Arg('agreementType', () => AgreementTypeEnum) agreementType: AgreementTypeEnum,
    @Ctx() { session, req }: Context
  ): Promise<StatusResponse> {
    const user = await session.load<User>(req.user!.id);
    if (user) {
      if (!user.agreements) {
        user.agreements = [];
      }
      user.agreements = [...user.agreements, new UserAgreement(agreementType, 1)];
      await session.saveChanges();
      if (sendEmail) {
        // Send email with whatever the wanted (AgreementTypeEnum)
      }
      return { status: true };
    } else {
      return { status: false };
    }
  }
  //#endregion

  //#region Field Resolvers

  @FieldResolver(() => String)
  name(@Root() user: User) {
    return `${user.firstName} ${user.lastName}`;
  }

  //#endregion
}
