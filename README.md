# Next.js Shopping Mall Demo

## Run

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## Project Structure

```text
src/
├── app/
│   ├── (auth)/register
│   ├── (shop)/
│   │   ├── page.tsx
│   │   ├── products/[id]/page.tsx
│   │   └── (member)/
│   │       ├── cart/page.tsx
│   │       ├── payment/page.tsx
│   │       └── account/*
│   ├── admin/
│   │   ├── products/page.tsx
│   │   └── orders/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       └── user/route.ts
├── components/
│   ├── common/
│   ├── layout/
│   └── product/
├── lib/
├── models/
├── services/
├── store/
└── types/
```

## Notes

- TypeScript alias `@/*` 는 `src/*`를 가리킵니다. (`tsconfig.json`)
- 인증/세션 로직은 `src/lib/auth.ts`와 `src/app/api/auth/[...nextauth]/route.ts`에서 관리합니다.
