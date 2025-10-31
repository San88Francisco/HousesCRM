/* eslint-disable */

type ErrorWithMessage = {
  message?: unknown;
  error?: unknown;
  data?: {
    message?: unknown;
  };
  status?: unknown;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const extractMessageFromObject = (error: ErrorWithMessage): string | null => {
  if (isObject(error.data) && typeof error.data.message === 'string') {
    return error.data.message;
  }

  if (typeof error.message === 'string') {
    return error.message;
  }

  if (typeof error.error === 'string') {
    return error.error;
  }

  if ('status' in error && isObject(error.data) && typeof error.data.message === 'string') {
    return error.data.message;
  }

  return null;
};

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (isObject(error)) {
    const message = extractMessageFromObject(error as ErrorWithMessage);
    if (message) {
      return message;
    }
  }

  if (error === null || error === undefined) {
    return 'Сталася невідома помилка';
  }

  return String(error);
};
