import { Field, ObjectType } from 'type-graphql';
import { SignedImageUrl } from './SignedImageUrl';
@ObjectType()
export class SignedImageUrlForWorkOrder {
  @Field(() => [SignedImageUrl])
  public images: SignedImageUrl[];

  @Field()
  public workOrderId: string;
}
