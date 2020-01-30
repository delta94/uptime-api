import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { DateTime } from 'luxon';

export const IsoDateTime = new GraphQLScalarType({
  name: 'IsoDateTime',
  parseValue(value: any): Date {
    console.log('[parseValue] value', value);
    let utc: Date;
    if (value instanceof Date) {
      utc = DateTime.fromJSDate(value)
        .toUTC(-value.getTimezoneOffset())
        .toJSDate();
    } else {
      const dateValue = new Date(value);
      utc = DateTime.fromJSDate(dateValue)
        .toUTC(-dateValue.getTimezoneOffset())
        .toJSDate();
    }
    return utc;
  },
  serialize(value: any): string {
    if (value === null) {
      return '';
    } else {
      if (typeof value === 'string') {
        return DateTime.fromISO(value)
          .toUTC()
          .toISO();
      } else {
        try {
          return DateTime.fromJSDate(value)
            .toUTC(-value.getTimezoneOffset())
            .toISO();
        } catch (e) {
          return DateTime.fromJSDate(value).toISO();
        }
      }
    }
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10); // ast value is always in string format
    }
    return null;
  },
});

// EpochDate: new GraphQLScalarType({
//   name: 'Date',
//   description: 'EpochDate custom scalar type',
//   parseValue(value): moment.Moment {
//     return moment(value); // value from the client
//   },
//   serialize(value: number): Date {
//     return moment.unix(value).toDate(); // value sent to the client
//   },
//   parseLiteral(ast) {
//     if (ast.kind === Kind.INT) {
//       return parseInt(ast.value, 10); // ast value is always in string format
//     }
//     return null;
//   },
// }),
// };
