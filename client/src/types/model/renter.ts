export interface RenterBase {
  firstName: string;
  lastName: string;
  age: number | null;
}

// Повний рентер, як приходить із бекенду
export interface RenterResponse extends RenterBase {
  id: string;
  occupied: string;
  vacated?: string;
  status: string;
  totalIncome?: number;
}
// Payload модалки
export interface RenterModalPayload {
  renter: RenterResponse;
}

export type CreateRenterPayload = RenterBase;
// Для створення нового рентера
