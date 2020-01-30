import { Field, ArgsType } from 'type-graphql';
import { ImageInfoInput } from './ImageInfoInput';
@ArgsType()
export class ImagesToSignForInspectionArgs {
  @Field()
  inspectionId: string;

  @Field({ nullable: true })
  checklistId: string;

  @Field(() => [ImageInfoInput])
  public images: ImageInfoInput[];
}
