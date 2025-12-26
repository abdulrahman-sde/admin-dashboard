import { randomUUID } from "crypto";

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = randomUUID().slice(0, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

export const generateTransactionNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = randomUUID().slice(0, 8).toUpperCase();
  return `TXN-${timestamp}-${random}`;
};
