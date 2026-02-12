// app/page.tsx
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  // 1. DB에서 데이터 읽기 (Node.js 환경처럼 바로 실행)
  const posts = await prisma.post.findMany();

  return (
    <main style={{ padding: '20px' }}>
      <h1>내 로컬 DB 데이터</h1>
      {posts.length === 0 ? (
        <p>데이터가 없습니다. DB에 데이터를 추가해보세요!</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
