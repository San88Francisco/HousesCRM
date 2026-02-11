import { SearchRequest } from '@/types/services/search';
import * as yup from 'yup';

export const searchSchema = yup.object({
  query: yup.string().trim(),
});

export const searchDefaultValues: SearchRequest = {
  query: '',
};
