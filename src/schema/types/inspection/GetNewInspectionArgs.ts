import { Field, ArgsType } from 'type-graphql';

@ArgsType()
export class GetNewInspectionArgs {
  @Field(() => String)
  equipmentId: string;
}
