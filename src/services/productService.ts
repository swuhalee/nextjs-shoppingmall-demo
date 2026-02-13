export type ProductSummary = {
  id: string;
  name: string;
  price: number;
};

export async function getProducts(): Promise<ProductSummary[]> {
  return [];
}
