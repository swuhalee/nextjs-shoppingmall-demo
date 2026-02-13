"use client";

import LoginDrawer from "@/components/login-drawer";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLoginStore } from "@/stores/use-login-store";

type MainShellProps = {
  children: React.ReactNode;
};

export default function MainShell({ children }: MainShellProps) {
  const { open } = useLoginStore();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <button
            type="button"
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            카테고리
          </button>

          <Link href="/" className="text-lg font-bold tracking-tight text-zinc-900">
            SHOPMALL
          </Link>

          <div className="flex items-center gap-2">
            {user ? (
              <Link
                href="/account/purchase"
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                마이페이지
              </Link>
            ) : (
              <button
                type="button"
                onClick={open}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                로그인
              </button>
            )}
            <Link
              href="/cart"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              장바구니
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 py-6">{children}</div>
      <LoginDrawer />
    </div>
  );
}
