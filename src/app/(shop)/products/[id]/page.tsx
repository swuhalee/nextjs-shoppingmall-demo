type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-zinc-900">ProductDetail</h1>
      <p className="mt-2 text-sm text-zinc-600">현재 상품 ID: {id}</p>
    </section>
  );
}
