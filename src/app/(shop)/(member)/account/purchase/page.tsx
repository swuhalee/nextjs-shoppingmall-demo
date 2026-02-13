"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { useLogoutMutation } from "@/hooks/mutations/use-auth-mutations";

export default function MyPage() {
  const { data: session } = useSession();
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const userName = session?.user?.name ?? "사용자";
  const email = session?.user?.email ?? "이메일 정보 없음";

  async function onLogout() {
    try {
      await logoutMutation.mutateAsync();
      toast.success("로그아웃되었습니다.");
      router.push("/");
    } catch {
      toast.error("로그아웃 처리 중 오류가 발생했습니다.");
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
      <div className="rounded-xl border border-zinc-200 p-5">
        <p className="text-xl font-semibold text-zinc-900">{userName}님</p>
        <p className="mt-1 text-sm text-zinc-600">{email}</p>
        <Link
          href="/account/profile"
          className="mt-4 inline-flex text-sm font-medium text-zinc-800 hover:text-zinc-600"
        >
          내 정보 관리 &gt;
        </Link>
      </div>

      <button
        type="button"
        onClick={onLogout}
        disabled={logoutMutation.isPending}
        className="mt-5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        로그아웃
      </button>
    </section>
  );
}
