import { Field, ArgsType } from 'type-graphql';
import { ImageInfoInput } from './ImageInfoInput';
@ArgsType()
export class ImagesToSignForMeterImageArgs {
  @Field()
  inspectionId: string;

  @Field(() => ImageInfoInput)
  public image: ImageInfoInput;
}
