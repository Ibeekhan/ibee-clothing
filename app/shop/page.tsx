import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getAllProducts, getAllCategories } from "@/lib/products";

export const dynamic = "force-dynamic";
export const metadata = { title: "Shop" };

function toCardData(p: any) {
  return {
    slug: p.slug,
    name: p.name,
    basePrice: p.basePrice,
    salePrice: p.salePrice,
    image: p.images[0]?.url ?? "/products/essential-tee-black.jpg",
    colors: [...new Set(p.variants.map((v: any) => v.color))] as string[],
    isFeatured: p.isFeatured,
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([getAllProducts(params), getAllCategories()]);

  const sortOptions = [
    { value: "", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
  ];

  function buildHref(overrides: Record<string, string | undefined>) {
    const next = { ...params, ...overrides };
    const qs = new URLSearchParams(
      Object.entries(next).filter(([, v]) => v) as [string, string][]
    ).toString();
    return `/shop${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="ibee-container py-12">
      <div className="mb-10">
        <h1 className="ibee-heading text-3xl md:text-4xl mb-2">Shop All</h1>
        <p className="text-sm text-black/60">{products.length} products</p>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-10">
        {/* FILTERS */}
        <aside className="space-y-8">
          <form action="/shop" method="get" className="flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={params.q}
              placeholder="Search products..."
              className="flex-1 border border-[var(--color-line)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-ink)]"
            />
          </form>

          <div>
            <p className="ibee-eyebrow mb-3">Category</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={buildHref({ category: undefined })} className={!params.category ? "font-semibold" : "text-black/60"}>
                  All
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={buildHref({ category: c.slug })}
                    className={params.category === c.slug ? "font-semibold" : "text-black/60"}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="ibee-eyebrow mb-3">Sort By</p>
            <ul className="space-y-2 text-sm">
              {sortOptions.map((s) => (
                <li key={s.value}>
                  <Link
                    href={buildHref({ sort: s.value || undefined })}
                    className={(params.sort ?? "") === s.value ? "font-semibold" : "text-black/60"}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <div>
          {products.length === 0 ? (
            <div className="py-20 text-center text-black/50">
              <p>No products match your filters.</p>
              <Link href="/shop" className="underline text-sm mt-2 inline-block">Clear filters</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((p) => (
                <ProductCard key={p.id} product={toCardData(p)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
