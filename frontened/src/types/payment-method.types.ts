export interface StorePaymentMethod {
  id: string;
  name: string;
  type:
    | "CREDIT_CARD"
    | "DEBIT_CARD"
    | "PAYPAL"
    | "BANK_TRANSFER"
    | "CASH_ON_DELIVERY";
  provider?: string;
  last4: string;
  expiryDate?: string;
  holderName: string;
  isDefault: boolean;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethodsResponse {
  status: string;
  data: StorePaymentMethod[];
}
