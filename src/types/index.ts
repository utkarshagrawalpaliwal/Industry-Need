export const ORDER_STATUSES = [
  "confirmed",
  "packed",
  "dispatched",
  "out_for_delivery",
  "delivered",
  "returned",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = ["pending", "paid", "refunded"] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
