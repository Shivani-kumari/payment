export type PaymentStatus =
  | 'IDLE'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'TIMEOUT';

export type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown';

export interface PaymentPayload {
  transactionId: string;
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  amount: number;
  currency: 'INR' | 'USD';
}

export interface Transaction {
  id: string;
  amount: number;
  status: PaymentStatus;
  timestamp: number;
  attempts: number;
}