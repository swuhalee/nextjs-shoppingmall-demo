import Link from "next/link";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string[];
};

export default function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <Link href={`/products/${id}`} className="block">
        <div
          className="aspect-square bg-zinc-100 bg-cover bg-center"
          role="img"
          aria-label={name}
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="p-4">
          <p className="text-xs text-zinc-500">{category.join(", ")}</p>
          <h3 className="mt-1 text-base font-semibold text-zinc-900">{name}</h3>
          <p className="mt-2 text-sm font-medium text-zinc-700">{price.toLocaleString("ko-KR")}원</p>
        </div>
      </Link>
    </article>
  );
}
