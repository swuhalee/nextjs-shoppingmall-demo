"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn, signOut } from "next-auth/react";

type LoginPayload = {
  email: string;
  password: string;
};

export function useLoginMutation() {
  return useMutation({
    mutationFn: async ({ email, password }: LoginPayload) => {
      let result: Awaited<ReturnType<typeof signIn>>;

      try {
        result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
      } catch {
        throw new Error("네트워크 오류로 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        throw new Error("로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }

      return result;
    },
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: async () => signOut({ redirect: false }),
  });
}
