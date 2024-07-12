import { Status } from './Status';

interface SendData<T> {
  status: Status;
  message: T;
}

export type { SendData };
