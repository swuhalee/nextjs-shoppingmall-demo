import { NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import ProductModel from "@/models/Product";

export const runtime = "nodejs";

export async function GET() {
  try {
    await dbConnect();

    const products = await ProductModel.find({ isDeleted: false, status: "active" })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      products: products.map((product) => ({
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
      })),
    });
  } catch {
    return NextResponse.json({ message: "상품 목록 조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}
