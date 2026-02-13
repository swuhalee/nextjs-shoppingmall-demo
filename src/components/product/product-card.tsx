type ProductCardProps = {
  name: string;
  price: number;
};

export default function ProductCard({ name, price }: ProductCardProps) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4">
      <p className="text-sm text-zinc-500">상품</p>
      <h3 className="mt-1 text-base font-semibold text-zinc-900">{name}</h3>
      <p className="mt-2 text-sm font-medium text-zinc-700">{price.toLocaleString()}원</p>
    </article>
  );
}
