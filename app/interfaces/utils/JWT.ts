import * as Restify from 'restify';

export interface IJWTToken {
  id: number;
}

export interface IOAuthToken {
  token_id: string;
  client_id: string;
}