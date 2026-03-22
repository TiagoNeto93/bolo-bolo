export default async function ProdutoPage(props: PageProps<"/produtos/[slug]">) {
  const { slug } = await props.params;

  return (
    <main className="flex flex-1 flex-col px-6 py-24 max-w-3xl mx-auto">
      <h1 className="font-heading text-4xl md:text-5xl text-espresso">
        {/* Product name from Sanity */}
        Produto: {slug}
      </h1>
      <div className="mt-8 text-warm-brown leading-relaxed">
        {/* Product details from Sanity */}
      </div>
    </main>
  );
}
