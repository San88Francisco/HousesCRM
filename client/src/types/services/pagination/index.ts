import { Metadata } from '@/types/core/metadata';
import {
  BaseQueryFn,
  EndpointBuilder,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

export type PaginatedResponse<T> = {
  data: T[];
  meta: Metadata;
};

export type ApiTagTypes = 'Auth' | 'Houses' | 'Analytics' | 'Renters' | 'Contracts';

export type ApiBaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>;

export type ApiEndpointBuilder = EndpointBuilder<ApiBaseQuery, ApiTagTypes, 'api'>;
