export type RegisterUserPayload = {
  email: string;
  password: string;
  name: string;
};

export type RegisterUserResponse = {
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    level: string;
    createdAt: string;
    updatedAt: string;
  };
};

function isRegisterUserResponse(value: unknown): value is RegisterUserResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const data = value as { message?: unknown; user?: unknown };

  if (data.message !== undefined && typeof data.message !== "string") {
    return false;
  }

  if (data.user === undefined) {
    return true;
  }

  if (typeof data.user !== "object" || data.user === null) {
    return false;
  }

  const user = data.user as Record<string, unknown>;
  return (
    typeof user.id === "string" &&
    typeof user.email === "string" &&
    typeof user.name === "string" &&
    typeof user.level === "string" &&
    typeof user.createdAt === "string" &&
    typeof user.updatedAt === "string"
  );
}

export async function registerUser(payload: RegisterUserPayload): Promise<RegisterUserResponse> {
  const response = await fetch("/api/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new Error("서버 응답을 처리할 수 없습니다.");
  }

  if (!isRegisterUserResponse(data)) {
    throw new Error("회원가입 응답 형식이 올바르지 않습니다.");
  }

  if (!response.ok) {
    throw new Error(data.message ?? "회원가입 실패");
  }

  return data;
}
