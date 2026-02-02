import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type RTKQueryError = FetchBaseQueryError | SerializedError | undefined;

export const isErrors = (error: RTKQueryError): boolean => {
  if (!error) return false;

  if ('status' in error && typeof error.status === 'number') {
    return error.status === 404;
  }

  return false;
};

export const isEntityNotFound = (error: RTKQueryError, data: unknown): boolean => {
  if (isErrors(error)) return true;

  if (error && !data) return true;

  return false;
};
