"use client";

import { useQuery } from "@tanstack/react-query";

import { getProductById, getProducts } from "@/services/productService";

export function useProductsQuery() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}

export function useProductDetailQuery(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });
}
