enum PaymentStatus {
  Pending = 'pending',
  Processing = 'processing',
  Success = 'success',
  Failed = 'failed',
}

export type Payment = {
  id: string;
  amount: number;
  status: PaymentStatus;
  email: string;
};
