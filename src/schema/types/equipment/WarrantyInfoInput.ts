import { ObjectType, Field, InputType, Int } from 'type-graphql';
import { WarrantyInfoTypeEnum } from '../Enums';
// hoursBeforeService
// serviceAdministrator - Notify - Once Parts ordered - Give Ticket to Mechanic as upcoming
// mechanic
@InputType()
export class WarrantyInfoInput {
  @Field(() => Int)
  public duration: number;

  @Field(() => WarrantyInfoTypeEnum)
  public type: WarrantyInfoTypeEnum;
}
