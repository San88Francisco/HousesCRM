import { Payment, PaymentStatus } from '@/types/services/payment';

export const mockData: Payment[] = [
  { id: 'm5gr84i9', amount: 316, status: PaymentStatus.Success, email: 'ken99@example.com' },
  { id: '3u1reuv4', amount: 242, status: PaymentStatus.Success, email: 'abe45@example.com' },
  {
    id: 'derv1ws0',
    amount: 837,
    status: PaymentStatus.Processing,
    email: 'monserrat44@example.com',
  },
  { id: '5kma53ae', amount: 874, status: PaymentStatus.Success, email: 'silas22@example.com' },
  { id: 'bhqecj4p', amount: 721, status: PaymentStatus.Failed, email: 'carmella@example.com' },
  { id: 'k1md84op', amount: 159, status: PaymentStatus.Processing, email: 'lisa77@gmail.com' },
  { id: 'u4pr83ty', amount: 690, status: PaymentStatus.Success, email: 'tom21@yahoo.com' },
  { id: 'z8na39we', amount: 405, status: PaymentStatus.Failed, email: 'sophie33@outlook.com' },
  { id: 'q9rt62kl', amount: 512, status: PaymentStatus.Success, email: 'jack99@mail.com' },
  { id: 'a7hy51zx', amount: 288, status: PaymentStatus.Processing, email: 'emma47@gmail.com' },
  { id: 'p3we74mn', amount: 934, status: PaymentStatus.Failed, email: 'chris08@yahoo.com' },
  { id: 'l2vb68sd', amount: 120, status: PaymentStatus.Success, email: 'nina15@outlook.com' },
  { id: 'r5yt81qp', amount: 678, status: PaymentStatus.Processing, email: 'alex55@example.com' },
  { id: 'd6gh92we', amount: 845, status: PaymentStatus.Failed, email: 'kate42@gmail.com' },
];
