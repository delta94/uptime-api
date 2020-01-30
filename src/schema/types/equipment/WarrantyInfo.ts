import { ObjectType, Field, InputType, Int } from 'type-graphql';
import { WarrantyInfoTypeEnum } from '../Enums';
// hoursBeforeService
// serviceAdministrator - Notify - Once Parts ordered - Give Ticket to Mechanic as upcoming
// mechanic
@ObjectType()
export class WarrantyInfo {
  @Field(() => Int)
  public duration: number;

  @Field(() => WarrantyInfoTypeEnum)
  public type: WarrantyInfoTypeEnum;
}
