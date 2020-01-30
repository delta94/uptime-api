import { CustomRequest } from '@/helpers/interfaces';
import { IDocumentSession } from 'ravendb';
import { AuthenticationError, UserInputError } from 'apollo-server-errors';
import { RoleTypeEnum, DayEnum } from '@/types/Enums';
import { find, forEach } from 'lodash';
import { User } from '@/types/user/User';
import { Fluid } from '@/types/appSettings/Fluid';
import { Equipment } from '@/types/equipment/Equipment';
import moment = require('moment');
import { Make } from '@/types/make/Make';
import { DealerContact } from '@/types/dealerContact/DealerContact';
import { JwtUser } from '@/types/JwtUser';
import short from 'short-uuid';
import { Classification } from '@/types/appSettings/Classification';
import equipment from '@/types/equipment';
import { DateTime } from 'luxon';

export interface AccessRole {
  role: string;
  roleType?: RoleTypeEnum;
}

export const verifyAccess = (req: CustomRequest, roles?: AccessRole[]) => {
  const { user } = req;
  if (!user) {
    throw new AuthenticationError('Not Logged In');
  } else if (roles === null) {
    return true;
  } else {
    let foundRole: boolean = false;
    forEach(roles, requiredRole => {
      const userRole = find(user.roles, userRole => userRole.name === requiredRole.role);
      if (userRole && !requiredRole.roleType) {
        foundRole = true;
        return false;
      } else if (userRole && requiredRole.roleType && userRole.type === requiredRole.roleType) {
        foundRole = true;
        return false;
      }
    });
    return foundRole;
  }
};

export const verifyAccessUser = (user: JwtUser, roles?: AccessRole[]) => {
  if (!user) {
    throw new AuthenticationError('Not Logged In');
  } else if (roles === null) {
    return true;
  } else {
    let foundRole: boolean = false;
    forEach(roles, requiredRole => {
      const userRole = find(user.roles, userRole => userRole.name === requiredRole.role);
      if (userRole && !requiredRole.roleType) {
        foundRole = true;
        return false;
      } else if (userRole && requiredRole.roleType && userRole.type === requiredRole.roleType) {
        foundRole = true;
        return false;
      }
    });
    return foundRole;
  }
};

export const checkEmail = async (email: string, session: IDocumentSession) => {
  if (email.trim() === '') return true;
  const count = await session
    .query<User>({ indexName: 'Users' })
    .whereEquals('email', email)
    .count();

  if (count === 0) {
    return true;
  } else {
    throw new UserInputError('Email already in use. Please try another email address.');
  }
};

export const checkDealerContact = async (email: string, session: IDocumentSession) => {
  const count = await session
    .query<DealerContact>({ indexName: 'DealersContact' })
    .whereEquals('email', email)
    .count();

  if (count === 0) {
    return true;
  } else {
    throw new UserInputError('Email already in use. Please try another email address.');
  }
};

export const isMakeUnique = async (name: string, session: IDocumentSession) => {
  const count = await session
    .query<Make>({ indexName: 'Makes' })
    .whereEquals('name', name)
    .count();

  if (count === 0) {
    return true;
  } else {
    throw new UserInputError('Name already exists. Please try another name.');
  }
};

export const getSuccessResetText = (usr: User) => {
  return (
    'Hi ' +
    usr.firstName +
    ',' +
    '<br /><br />' +
    "You've successfully changed your password." +
    '<br /><br />' +
    'Thanks for using Equipment Uptime!<br />' +
    'The Equipment Uptime Team'
  );
};

export const getPasswordResetText = (usr: User, resetLink: string) => {
  return (
    'A password reset has been requested for username: ' +
    '<br /><b>' +
    usr.firstName +
    ' ' +
    usr.lastName +
    '</b><br /><br />' +
    'If you did not make this request, you can safely ignore this email. A password reset request can be made by anyone,' +
    'and it does not indicate that your account is in any danger of being accessed by someone else.' +
    '<br /><br />' +
    'If you do actually want to reset your password, visit this link:' +
    '<br />' +
    resetLink +
    '<br /><br />' +
    'Thank you for using the site!' +
    '<br />' +
    'Equipment Uptime Security Team</pre>'
  );
};

export const Roles = {
  Administrator: 'Administrator',
  Client: 'Client',
  Operator: 'Operator',
  Mechanic: 'Mechanic',
};

export const getAppSettings = async <T extends object>(session: IDocumentSession, whichAppSetting: string): Promise<T> => {
  return <T>(<unknown>session.load<T>(`AppSettings/${whichAppSetting}`));
};

export const capitalize = (s: string) => {
  return s.replace(/(?:^|\s)\S/g, (a: string) => {
    return a.toUpperCase();
  });
};

export const capitalizeEachFirstLetter = (str: string, keepUpperCaseIfUpperCase: boolean = true): string => {
  try {
    return str
      .toString()
      .trim()
      .split(' ')
      .map(word => {
        if (word === word.toUpperCase() && keepUpperCaseIfUpperCase) {
          return word;
        }

        let formattedWord = word.toLowerCase();
        formattedWord = formattedWord.charAt(0).toUpperCase() + formattedWord.substring(1);

        word.toLowerCase().replace(/\//g, (match, index) => {
          formattedWord =
            formattedWord.substr(0, index) +
            formattedWord.charAt(index).toLowerCase() +
            formattedWord.charAt(index + 1).toUpperCase() +
            formattedWord.substr(index + 2);
          return formattedWord;
        });

        word.toLowerCase().replace(/-/g, (match, index) => {
          formattedWord =
            formattedWord.substr(0, index) +
            formattedWord.charAt(index).toLowerCase() +
            formattedWord.charAt(index + 1).toUpperCase() +
            formattedWord.substr(index + 2);
          return formattedWord;
        });

        word.toLowerCase().replace(/\(/g, (match, index) => {
          formattedWord =
            formattedWord.substr(0, index) +
            formattedWord.charAt(index).toLowerCase() +
            formattedWord.charAt(index + 1).toUpperCase() +
            formattedWord.substr(index + 2);
          return formattedWord;
        });

        if (formattedWord.toLowerCase().startsWith('w/')) {
          formattedWord = word.charAt(0).toLowerCase() + formattedWord.substring(1);
        }

        return formattedWord;
      })
      .join(' ');
  } catch (ex) {
    return str;
  }
};

export const fluidCheck = async (newName: string, fluids: Fluid[]) => {
  const foundElement = fluids.some(x => x.name === newName);
  if (!foundElement) {
    // insert newName to fluids
    fluids.push({ name: capitalize(newName) });
  }
};

export const classificationCheck = async (newName: string, classifications: Classification[]) => {
  const foundElement = classifications.some(x => x.name === newName);
  if (!foundElement) {
    // insert newName to fluids
    classifications.push({ name: capitalize(newName) });
  }
};

export const isEquipmentNameTaken = async (session: IDocumentSession, name: string, clientId: string) => {
  return session
    .query<Equipment>({ indexName: 'Equipment' })
    .whereEquals('name', name)
    .whereEquals('clientId', clientId)
    .any();
};

export const formatSearchTerm = (searchTerm: string[]): string => {
  let aux = '';
  searchTerm.forEach(term => {
    aux += `*${term}*`;
  });
  return aux;
};

export const getEstimateUsageForDay = (equipment: Equipment): number => {
  const day = moment().isoWeekday();
  // console.log(DayEnum[day].toLowerCase());
  return equipment.expectedUsage[DayEnum[day].toLowerCase()];
};

export const getShortUuid = (): string => {
  return short.generate();
};

export const getShortCookieUuid = (): string => {
  const cookieTranslator = short(short.constants.cookieBase90);
  return cookieTranslator.generate();
};

export const getNowUtc = (): Date => {
  return DateTime.utc().toJSDate();
};

export const getNowUtcByTimezone = (timezone: string): string => {
  return DateTime.utc()
    .setZone(timezone)
    .toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS);
};

export const enumAsString = (str: string) => {
  return (
    str
      // Look for long acronyms and filter out the last letter
      .replace(/([A-Z]+)([A-Z][a-z])/g, ' $1 $2')
      // Look for lower-case letters followed by upper-case letters
      .replace(/([a-z\d])([A-Z])/g, '$1 $2')
      // Look for lower-case letters followed by numbers
      .replace(/([a-zA-Z])(\d)/g, '$1 $2')
      .replace(/^./, str => {
        return str.toUpperCase();
      })
      // Remove any white space left around the word
      .trim()
  );
};
