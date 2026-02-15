"use client";

import ProductCard from "@/components/product/product-card";
import { useProductsQuery } from "@/hooks/queries/use-product-queries";

export default function ProductAllPage() {
  const productsQuery = useProductsQuery();

  if (productsQuery.isLoading) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-zinc-600 shadow-sm">
        상품 목록을 불러오는 중입니다.
      </section>
    );
  }

  if (productsQuery.isError) {
    const message =
      productsQuery.error instanceof Error
        ? productsQuery.error.message
        : "상품 목록을 불러오지 못했습니다.";

    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
        {message}
      </section>
    );
  }

  const products = productsQuery.data ?? [];

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">ProductAll</h1>
      {products.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-zinc-600 shadow-sm">
          등록된 상품이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category}
            />
          ))}
        </div>
      )}
    </section>
  );
}
