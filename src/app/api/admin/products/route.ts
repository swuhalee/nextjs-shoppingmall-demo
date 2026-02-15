import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import ProductModel from "@/models/Product";

export const runtime = "nodejs";

type CreateProductBody = {
  sku?: string;
  name?: string;
  image?: string;
  price?: number;
  description?: string;
  stock?: number;
  category?: string[];
  status?: string;
};

function normalizeCategories(input: string[] | undefined): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((category) => category.trim())
    .filter((category, index, arr) => category.length > 0 && arr.indexOf(category) === index);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
    }

    if (session.user.level !== "admin") {
      return NextResponse.json({ message: "관리자 권한이 필요합니다." }, { status: 403 });
    }

    const body = (await request.json()) as CreateProductBody;

    const sku = body.sku?.trim();
    const name = body.name?.trim();
    const image = body.image?.trim();
    const description = body.description?.trim();
    const price = Number(body.price);
    const stock = Number(body.stock);
    const category = normalizeCategories(body.category);
    const status = body.status?.trim() || "active";

    if (!sku || !name || !image || !description || category.length === 0) {
      return NextResponse.json(
        { message: "sku, name, image, description, category는 필수입니다." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ message: "price는 0 이상의 숫자여야 합니다." }, { status: 400 });
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return NextResponse.json({ message: "stock은 0 이상의 정수여야 합니다." }, { status: 400 });
    }

    await dbConnect();

    const exists = await ProductModel.exists({ sku });
    if (exists) {
      return NextResponse.json({ message: "이미 사용 중인 sku입니다." }, { status: 409 });
    }

    const createdProduct = await ProductModel.create({
      sku,
      name,
      image,
      price,
      description,
      stock,
      category,
      status,
    });

    const product = createdProduct.toObject();

    return NextResponse.json(
      {
        message: "상품이 생성되었습니다.",
        product: {
          id: String(product._id),
          sku: product.sku,
          name: product.name,
          image: product.image,
          price: product.price,
          description: product.description,
          stock: product.stock,
          category: product.category,
          status: product.status,
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      return NextResponse.json({ message: "이미 사용 중인 sku입니다." }, { status: 409 });
    }

    return NextResponse.json({ message: "상품 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
