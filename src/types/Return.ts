import { SendData } from './SendData';
import { Status } from './Status';

interface Return<T> {
  status: Status;
  statusCode: number;
  send: SendData<T>;
  additionalInformation?: Record<string, unknown>;
}

export type { Return };
