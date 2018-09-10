import { Request as IReq, Response as IRes } from 'restify';

export interface IRequest extends IReq {
  client_id: string;
  decoded: {
    user_id: number;
  };
  query: any;
}

export interface IResponse extends IRes {}
