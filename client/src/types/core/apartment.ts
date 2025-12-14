// import { ApartmentFormData } from '@/shared/validation/add-apartments/apartment-schema';
// import { ApartmentType } from './houses';

// // Тип для даних з API
// export interface ApartmentFromAPI {
//   id: string | number;
//   apartmentName: string;
//   roomsCount: number;
//   totalArea: number;
//   purchaseDate: string; // з API приходить string
//   floor: number;
//   street: string;
//   apartmentType: ApartmentType; // тип з API
//   prices?: Array<{
//     id: string;
//     amount: number;
//     code: string;
//     exchangeRate: number;
//   }>;
// }

// export interface ApartmentToEdit extends Omit<ApartmentFormData, 'price' | 'purchaseDate'> {
//   id: string | number;
//   price?: number; // Опціонально для форми
//   prices: Array<{
//     id: string;
//     amount: number;
//     code: string;
//     exchangeRate: number;
//   }>;
//   purchaseDate: string | Date;
// }

// export interface ApartmentModalPayload {
//   apartment?: ApartmentToEdit;
// }
import { ApartmentFormData } from '@/shared/validation/add-apartments/apartment-schema';
import { ApartmentType } from './houses';

export interface ApartmentFromAPI {
  id: string | number;
  apartmentName: string;
  roomsCount: number;
  totalArea: number;
  purchaseDate: string;
  floor: number;
  street: string;
  apartmentType: ApartmentType;
  prices?: Array<{
    id: string;
    amount: number;
    code: string;
    exchangeRate: number;
  }>;
}

export interface ApartmentToEdit extends Omit<ApartmentFormData, 'price' | 'purchaseDate'> {
  id: string | number;
  price?: number;
  prices: Array<{
    id: string;
    amount: number;
    code: string;
    exchangeRate: number;
  }>;
  purchaseDate: string | Date;
}
