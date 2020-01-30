import { Field, ObjectType } from 'type-graphql';
@ObjectType()
export class SignedImageUrlForInspection {
  @Field()
  public fileName: string;

  @Field()
  public awsWebUrl: string;

  @Field()
  public signedUrl: string;

  @Field()
  public checklistId: string;
}
