import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class SignedImageUrlForMeterImage {
  @Field()
  public fileName: string;
  @Field()
  public awsWebUrl: string;
  @Field()
  public signedUrl: string;
}
