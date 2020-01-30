import { Field, InputType } from 'type-graphql';
@InputType()
export class ImageInfoInput {
  @Field()
  public fileName: string;

  @Field()
  public fileType: string;
}
