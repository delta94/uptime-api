import * as express from 'express';
import { IDocumentSession, IDocumentStore } from 'ravendb';
import { JwtUser } from '@/types/JwtUser';
import { User } from '@/types/user/User';

export interface CustomRequest extends express.Request {
  // userSession: {
  //   user: ICookieSession;
  //   nowInMinutes: number;
  // };
  db: IDocumentStore;
  user?: JwtUser;
}

export interface ICookieSession {
  id?: string;
  email?: string;
  roles?: string[];
  token: string;
}

export interface Context {
  store: IDocumentStore;
  session: IDocumentSession;
  req: CustomRequest;
  res: express.Response;
  users?: User;
}
