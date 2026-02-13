"use client";

import { useMutation } from "@tanstack/react-query";

import { registerUser, RegisterUserPayload } from "@/services/userService";

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterUserPayload) => registerUser(payload),
  });
}
