import { AsyncLocalStorage } from 'async_hooks';

export interface RequestUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export const requestContext = new AsyncLocalStorage<RequestUser>();
