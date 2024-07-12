import { SendData } from '../SendData';

declare module 'express' {
  interface Response {
    // eslint-disable-next-line no-unused-vars
    send(body: SendData<string | object>): this;
  }
}
