import { NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import { hashPassword } from "@/lib/password";
import UserModel from "@/models/User";

export const runtime = "nodejs";

type SignupBody = {
  email?: string;
  password?: string;
  name?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignupBody;
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();
    const name = body.name?.trim();

    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "email, password, name은 필수입니다." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "비밀번호는 최소 8자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    await dbConnect();

    const exists = await UserModel.exists({ email });
    if (exists) {
      return NextResponse.json({ message: "이미 사용 중인 이메일입니다." }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const createdUser = await UserModel.create({
      email,
      password: hashedPassword,
      name,
      level: "customer",
    });

    const user = createdUser.toObject();
    return NextResponse.json(
      {
        message: "회원가입이 완료되었습니다.",
        user: {
          id: String(user._id),
          email: user.email,
          name: user.name,
          level: user.level,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
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
      return NextResponse.json({ message: "이미 사용 중인 이메일입니다." }, { status: 409 });
    }

    return NextResponse.json({ message: "회원가입 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
