"use client";

import { useMutation } from "@tanstack/react-query";

import { CreateProductPayload, createProduct } from "@/services/productService";

export function useCreateProductMutation() {
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
  });
}
