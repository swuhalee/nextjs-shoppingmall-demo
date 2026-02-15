"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { useCreateProductMutation } from "@/hooks/mutations/use-product-mutations";

const DEFAULT_STATUS = "active";

export default function AdminProductPage() {
  const createProductMutation = useCreateProductMutation();
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [status, setStatus] = useState(DEFAULT_STATUS);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const categories = categoryInput
      .split(",")
      .map((category) => category.trim())
      .filter((category, index, arr) => category.length > 0 && arr.indexOf(category) === index);

    if (
      !sku.trim() ||
      !name.trim() ||
      !image.trim() ||
      !price.trim() ||
      !stock.trim() ||
      !description.trim() ||
      categories.length === 0
    ) {
      toast.error("모든 필수값을 입력해주세요.");
      return;
    }

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      toast.error("가격은 0 이상의 숫자로 입력해주세요.");
      return;
    }

    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      toast.error("재고는 0 이상의 정수로 입력해주세요.");
      return;
    }

    try {
      const data = await createProductMutation.mutateAsync({
        sku: sku.trim(),
        name: name.trim(),
        image: image.trim(),
        price: parsedPrice,
        stock: parsedStock,
        description: description.trim(),
        category: categories,
        status,
      });

      toast.success(data.message ?? "상품이 생성되었습니다.");

      setSku("");
      setName("");
      setImage("");
      setPrice("");
      setStock("");
      setDescription("");
      setCategoryInput("");
      setStatus(DEFAULT_STATUS);
    } catch (error) {
      const message = error instanceof Error ? error.message : "상품 생성 처리 중 오류가 발생했습니다.";
      toast.error(message);
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-zinc-900">상품 생성</h1>
      <p className="mt-2 text-sm text-zinc-600">관리자 전용 상품 등록 폼입니다.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="sku" className="mb-1 block text-sm font-medium text-zinc-700">
            SKU
          </label>
          <input
            id="sku"
            value={sku}
            onChange={(event) => setSku(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            placeholder="NK-TSHIRT-001"
          />
        </div>

        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-zinc-700">
            상품명
          </label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            placeholder="나이키 반팔 티셔츠"
          />
        </div>

        <div>
          <label htmlFor="image" className="mb-1 block text-sm font-medium text-zinc-700">
            이미지 URL
          </label>
          <input
            id="image"
            type="url"
            value={image}
            onChange={(event) => setImage(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            placeholder="https://example.com/product.jpg"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium text-zinc-700">
              가격
            </label>
            <input
              id="price"
              type="number"
              min={0}
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
              placeholder="100000"
            />
          </div>

          <div>
            <label htmlFor="stock" className="mb-1 block text-sm font-medium text-zinc-700">
              재고
            </label>
            <input
              id="stock"
              type="number"
              min={0}
              step={1}
              value={stock}
              onChange={(event) => setStock(event.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
              placeholder="30"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-zinc-700">
            카테고리 (콤마로 구분)
          </label>
          <input
            id="category"
            value={categoryInput}
            onChange={(event) => setCategoryInput(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            placeholder="top, men"
          />
        </div>

        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium text-zinc-700">
            상태
          </label>
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-10 w-full appearance-none rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none focus:border-zinc-900"
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-zinc-700">
            설명
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-28 w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            placeholder="상품 설명을 입력해주세요."
          />
        </div>

        <button
          type="submit"
          disabled={createProductMutation.isPending}
          className="inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createProductMutation.isPending ? "생성 중..." : "상품 생성"}
        </button>
      </form>
    </section>
  );
}
