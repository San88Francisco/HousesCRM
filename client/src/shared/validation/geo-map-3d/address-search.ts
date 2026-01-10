import * as yup from 'yup';

export interface AddressSearchRequest {
  address: string;
}

export const addressSearchSchema = yup.object({
  address: yup.string().required().default(''),
});

export const addressSearchDefaultValues: AddressSearchRequest = {
  address: '',
};
