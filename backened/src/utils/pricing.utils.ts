export const calculateOrderPricing = (params: {
  items: { unitPrice: number; quantity: number }[];
  shippingFee?: number;
  taxRate?: number;
  discountAmount?: number;
  discountPercent?: number;
}) => {
  const subtotal = params.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const shipping = params.shippingFee ?? 0;

  // Calculate discount
  let discount = params.discountAmount ?? 0;
  if (params.discountPercent) {
    discount = subtotal * (params.discountPercent / 100);
  }

  // Calculate tax on (subtotal - discount)
  // Assuming tax is applied after discount but before shipping
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = params.taxRate ? taxableAmount * (params.taxRate / 100) : 0;

  const totalAmount = subtotal + shipping + tax - discount;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    shippingFee: Number(shipping.toFixed(2)),
    taxAmount: Number(tax.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
  };
};
