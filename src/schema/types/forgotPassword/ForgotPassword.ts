import { Field, ObjectType } from 'type-graphql';
import { generate, characters } from 'shortid';

@ObjectType()
export class ForgotPassword {
  static async fromForgotPasswordInput(userId: string) {
    let forgotPass: ForgotPassword;
    // use $ and @ instead of - and _
    characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
    const token = generate();
    // console.log(token);
    forgotPass = new this(userId, token);
    return forgotPass;
  }

  @Field()
  public readonly id?: string;

  @Field()
  public userId: string;

  @Field()
  public token: string;

  constructor(userId: string, token: string) {
    this.userId = userId;
    this.id = 'ForgotPassword/' + token;
    this.token = token;
  }
}
