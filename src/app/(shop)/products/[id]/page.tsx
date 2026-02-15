"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useProductDetailQuery } from "@/hooks/queries/use-product-queries";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const productQuery = useProductDetailQuery(id);

  if (productQuery.isLoading) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-zinc-600 shadow-sm">
        상품 정보를 불러오는 중입니다.
      </section>
    );
  }

  if (productQuery.isError || !productQuery.data) {
    const message =
      productQuery.error instanceof Error ? productQuery.error.message : "상품 정보를 불러오지 못했습니다.";

    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
        {message}
      </section>
    );
  }

  const product = productQuery.data;
  const isSoldOut = product.stock <= 0;

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <article className="self-start overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="relative aspect-square bg-zinc-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
      </article>

      <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {product.category.map((item) => (
            <span
              key={item}
              className="inline-flex rounded-full border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-600"
            >
              {item}
            </span>
          ))}
        </div>

        <h1 className="mt-4 text-2xl font-bold text-zinc-900">{product.name}</h1>
        <p className="mt-2 text-2xl font-semibold text-zinc-900">{product.price.toLocaleString("ko-KR")}원</p>

        <div className="mt-4 space-y-1 border-y border-zinc-200 py-4 text-sm text-zinc-600">
          <p>상품코드: {product.sku}</p>
          <p>재고: {isSoldOut ? "품절" : `${product.stock}개`}</p>
        </div>

        <p className="mt-4 whitespace-pre-line text-sm leading-6 text-zinc-700">{product.description}</p>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            disabled={isSoldOut}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            {isSoldOut ? "품절" : "장바구니 담기"}
          </button>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            목록으로
          </Link>
        </div>
      </article>
    </section>
  );
}
