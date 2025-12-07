import { SearchResponse } from '@/types/services/search';

export const showSeparator = (data?: SearchResponse) =>
  !!data && [data.houses, data.renters, data.contracts].filter(arr => arr?.length).length > 1;
