"use client";

import { useMutation } from "@tanstack/react-query";

import { registerUser, RegisterUserPayload } from "@/lib/api/user";

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterUserPayload) => registerUser(payload),
  });
}
