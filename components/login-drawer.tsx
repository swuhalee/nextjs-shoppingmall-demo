"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { useLoginMutation } from "@/hooks/mutations/use-auth-mutations";
import { useLoginStore } from "@/stores/use-login-store";

const DRAWER_TRANSITION_MS = 600;

export default function LoginDrawer() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const { isOpen, close } = useLoginStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function resetForm() {
    setEmail("");
    setPassword("");
    setShowPassword(false);
  }

  function onClose() {
    resetForm();
    close();
  }

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
      resetForm();
      close();
      router.push("/");
      toast.success("로그인되었습니다.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "로그인 처리 중 오류가 발생했습니다.";
      toast.error(message);
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/35 transition-opacity ease-in-out ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
        style={{ transitionDuration: `${DRAWER_TRANSITION_MS}ms` }}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm border-l border-zinc-200 bg-white p-6 shadow-2xl transition-transform ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        style={{ transitionDuration: `${DRAWER_TRANSITION_MS}ms` }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900">로그인</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            닫기
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-zinc-700">
              이메일
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
              placeholder="hello@example.com"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="login-password" className="mb-1 block text-sm font-medium text-zinc-700">
              비밀번호
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 pr-11 outline-none focus:border-zinc-900"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loginMutation.isPending ? (
              <>
                <span
                  className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  aria-hidden="true"
                />
                <span className="sr-only">처리 중</span>
              </>
            ) : (
              "로그인"
            )}
          </button>
        </form>

        <Link
          href="/register"
          className="mt-4 block w-full rounded-lg border border-zinc-300 px-4 py-2 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          onClick={onClose}
        >
          회원가입
        </Link>
      </aside>
    </>
  );
}
