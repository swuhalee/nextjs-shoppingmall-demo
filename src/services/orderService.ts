export type OrderSummary = {
  id: string;
  totalPrice: number;
  status: string;
};

export async function getOrders(): Promise<OrderSummary[]> {
  return [];
}
