"use client";

import Link from "next/link";
import { SubmitEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useLoginMutation } from "@/hooks/mutations/use-auth-mutations";
import { useRegisterMutation } from "@/hooks/mutations/use-register-mutation";

export default function RegisterPage() {
  const registerMutation = useRegisterMutation();
  const loginMutation = useLoginMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAutoLoginSucceeded, setIsAutoLoginSucceeded] = useState(false);

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim() || !passwordConfirm.trim()) {
      toast.error("이름, 이메일, 비밀번호, 비밀번호 확인을 모두 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const data = await registerMutation.mutateAsync({ name, email, password });
      let autoLoginSucceeded = true;

      try {
        await loginMutation.mutateAsync({ email, password });
      } catch {
        autoLoginSucceeded = false;
        toast.error("회원가입은 완료됐지만 자동 로그인에 실패했습니다.");
      }

      toast.success(data.message ?? "회원가입 완료");
      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirm("");
      setShowPassword(false);
      setShowPasswordConfirm(false);
      setIsAutoLoginSucceeded(autoLoginSucceeded);
      setIsRegistered(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "요청 중 오류가 발생했습니다.";
      toast.error(message);
    }
  }

  if (isRegistered) {
    return (
      <section className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-lg font-semibold text-zinc-900">회원가입이 완료되었습니다.</p>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          {isAutoLoginSucceeded ? (
            <>
              SHOPPINGMALL의 다양한 혜택을 누려보세요.
              <br />
              이메일을 통해 제품 발매 정보와 협업 컬렉션 등 다양한 소식을 빠르게 확인할 수 있습니다.
            </>
          ) : (
            "자동 로그인에 실패했습니다. 로그인 후 마이페이지를 이용해주세요."
          )}
        </p>

        <Link
          href={isAutoLoginSucceeded ? "/account/purchase" : "/"}
          className="mt-6 inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          {isAutoLoginSucceeded ? "마이페이지" : "로그인하러 가기"}
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-lg font-semibold text-zinc-900">회원가입</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-zinc-700">
            이름
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            placeholder="홍길동"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-700">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
            placeholder="hello@example.com"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-700">
            비밀번호 (8자 이상)
          </label>
          <div className="relative">
            <input
              id="password"
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

        <div className="mb-5">
          <label htmlFor="password-confirm" className="mb-1 block text-sm font-medium text-zinc-700">
            비밀번호 확인
          </label>
          <div className="relative">
            <input
              id="password-confirm"
              type={showPasswordConfirm ? "text" : "password"}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 pr-11 outline-none focus:border-zinc-900"
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm((prev) => !prev)}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              aria-label={showPasswordConfirm ? "비밀번호 확인 숨기기" : "비밀번호 확인 보기"}
              aria-pressed={showPasswordConfirm}
            >
              {showPasswordConfirm ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending || loginMutation.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {registerMutation.isPending || loginMutation.isPending ? (
            <>
              <span
                className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden="true"
              />
              <span className="sr-only">처리 중</span>
            </>
          ) : (
            "회원가입"
          )}
        </button>
      </form>
    </section>
  );
}
