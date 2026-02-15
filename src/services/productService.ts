export type ProductSummary = {
  id: string;
  sku: string;
  name: string;
  image: string;
  price: number;
  description: string;
  stock: number;
  category: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductDetail = ProductSummary;

export type CreateProductPayload = {
  sku: string;
  name: string;
  image: string;
  price: number;
  description: string;
  stock: number;
  category: string[];
  status?: string;
};

export type CreateProductResponse = {
  message?: string;
  product?: ProductDetail;
};

type ProductListResponse = {
  products: ProductSummary[];
};

type ProductDetailResponse = {
  message?: string;
  product?: ProductDetail;
};

function isProductShape(value: unknown): value is ProductSummary {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const product = value as Record<string, unknown>;

  return (
    typeof product.id === "string" &&
    typeof product.sku === "string" &&
    typeof product.name === "string" &&
    typeof product.image === "string" &&
    typeof product.price === "number" &&
    typeof product.description === "string" &&
    typeof product.stock === "number" &&
    Array.isArray(product.category) &&
    product.category.every((item) => typeof item === "string") &&
    typeof product.status === "string" &&
    typeof product.createdAt === "string" &&
    typeof product.updatedAt === "string"
  );
}

function isProductListResponse(value: unknown): value is ProductListResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const data = value as { products?: unknown };

  return Array.isArray(data.products) && data.products.every((product) => isProductShape(product));
}

function isCreateProductResponse(value: unknown): value is CreateProductResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const data = value as { message?: unknown; product?: unknown };

  if (data.message !== undefined && typeof data.message !== "string") {
    return false;
  }

  if (data.product === undefined) {
    return true;
  }

  return isProductShape(data.product);
}

function isProductDetailResponse(value: unknown): value is ProductDetailResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const data = value as { message?: unknown; product?: unknown };

  if (data.message !== undefined && typeof data.message !== "string") {
    return false;
  }

  if (data.product === undefined) {
    return true;
  }

  return isProductShape(data.product);
}

export async function createProduct(payload: CreateProductPayload): Promise<CreateProductResponse> {
  const response = await fetch("/api/admin/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new Error("서버 응답을 처리할 수 없습니다.");
  }

  if (!isCreateProductResponse(data)) {
    throw new Error("상품 생성 응답 형식이 올바르지 않습니다.");
  }

  if (!response.ok) {
    throw new Error(data.message ?? "상품 생성 실패");
  }

  return data;
}

export async function getProducts(): Promise<ProductSummary[]> {
  const response = await fetch("/api/products", {
    method: "GET",
    cache: "no-store",
  });

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new Error("서버 응답을 처리할 수 없습니다.");
  }

  if (!isProductListResponse(data)) {
    throw new Error("상품 목록 응답 형식이 올바르지 않습니다.");
  }

  if (!response.ok) {
    throw new Error("상품 목록 조회 실패");
  }

  return data.products;
}

export async function getProductById(id: string): Promise<ProductDetail> {
  const response = await fetch(`/api/products/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new Error("서버 응답을 처리할 수 없습니다.");
  }

  if (!isProductDetailResponse(data)) {
    throw new Error("상품 상세 응답 형식이 올바르지 않습니다.");
  }

  if (!response.ok) {
    throw new Error(data.message ?? "상품 조회 실패");
  }

  if (!data.product) {
    throw new Error("상품을 찾을 수 없습니다.");
  }

  return data.product;
}
