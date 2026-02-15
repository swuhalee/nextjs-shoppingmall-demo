import { Types } from "mongoose";
import { NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import ProductModel from "@/models/Product";

type ProductDetailRouteProps = {
  params: Promise<{ id: string }>;
};

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: ProductDetailRouteProps) {
  try {
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "상품을 찾을 수 없습니다." }, { status: 404 });
    }

    await dbConnect();

    const product = await ProductModel.findOne({
      _id: id,
      isDeleted: false,
      status: "active",
    }).lean();

    if (!product) {
      return NextResponse.json({ message: "상품을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({
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
    });
  } catch {
    return NextResponse.json({ message: "상품 조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}
