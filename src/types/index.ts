export type OrderStatus =
  | "confirmed"
  | "packed"
  | "dispatched"
  | "out_for_delivery"
  | "delivered"
  | "returned";

export type PaymentStatus = "pending" | "paid" | "refunded";
