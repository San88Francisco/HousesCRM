export interface RenterBase {
  firstName: string;
  lastName: string;
  occupied: string;
  vacated: string;
}

export interface RenterResponse extends RenterBase {
  id: string;
}

export type CreateRenterPayload = RenterBase;
