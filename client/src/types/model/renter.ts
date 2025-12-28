export type RenterBase = {
  firstName: string;
  lastName: string;
  age: number;
};

// Повний рентер, який приходить із бекенду
export type RenterResponse = RenterBase & {
  id: string;
  occupied: string;
  vacated?: string;
  status: string;
  totalIncome?: number;
};

// Payload модалки
export type RenterModalPayload = {
  renter: RenterResponse;
};

export type CreateRenterPayload = RenterBase;
// Для створення нового рентера
