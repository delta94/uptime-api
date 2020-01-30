import { Field, ArgsType } from 'type-graphql';
import { ImageInfoInput } from './ImageInfoInput';

@ArgsType()
export class ImagesToSignArgs {
  @Field(() => [ImageInfoInput])
  public images: ImageInfoInput[];
}
