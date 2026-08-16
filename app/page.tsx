import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ProductCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getFeaturedProducts, getNewArrivals } from "@/lib/products";

export const dynamic = "force-dynamic"; // always reflects latest inventory/prices

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

export default async function HomePage() {
  const [featured, newArrivals] = await Promise.all([getFeaturedProducts(), getNewArrivals()]);

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden bg-[var(--color-ink)]">
        <Image
          src="/hero/hero-main.jpg"
          alt="IBEE Clothing"
          fill
          priority
          className="object-cover opacity-70"
        />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <p className="ibee-eyebrow text-white/70 mb-4">IBEE Clothing</p>
          <h1 className="ibee-heading text-white text-5xl md:text-7xl">WEAR YOUR IDENTITY.</h1>
          <Link href="/shop" className="mt-8">
            <Button variant="secondary" size="lg">Shop Now</Button>
          </Link>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="ibee-container py-20">
        <div className="flex items-end justify-between mb-8">
          <h2 className="ibee-heading text-2xl md:text-3xl">New Arrivals</h2>
          <Link href="/shop?sort=newest" className="text-sm underline underline-offset-4">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={toCardData(p)} />
          ))}
        </div>
      </section>

      {/* FEATURED / EDITORIAL */}
      <section className="bg-[var(--color-ink)] text-white py-24">
        <div className="ibee-container grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5]">
            <Image src="/products/signature-hoodie-charcoal.jpg" alt="Featured Collection" fill className="object-cover" />
          </div>
          <div>
            <p className="ibee-eyebrow text-white/60 mb-4">Featured Collection</p>
            <h2 className="ibee-heading text-3xl md:text-5xl mb-6">The Signature Edit</h2>
            <p className="text-white/70 max-w-md mb-8">
              Built for everyday confidence — restrained design, honest fabric, and a fit that
              works whether you&apos;re on campus or off duty.
            </p>
            <Link href="/shop">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--color-ink)]">
                Explore Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="ibee-container py-20">
        <h2 className="ibee-heading text-2xl md:text-3xl mb-8">Best Sellers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {featured.map((p) => (
            <ProductCard key={p.id} product={toCardData(p)} />
          ))}
        </div>
      </section>

      {/* BRAND STORY */}
      <section id="story" className="ibee-container py-24 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-[220px_1fr] gap-10 items-center text-center md:text-left">
          <div className="mx-auto md:mx-0 w-40 h-40 md:w-full md:h-auto aspect-square overflow-hidden rounded-full md:rounded-none">
            <Image
              src="/founder/founder.jpg"
              alt="Founder of IBEE Clothing"
              width={220}
              height={220}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
          <div>
            <p className="ibee-eyebrow mb-4">Our Story</p>
            <h2 className="ibee-heading text-3xl md:text-4xl mb-6">Built by a student, for students.</h2>
            <p className="text-black/70 leading-relaxed">
              IBEE Clothing started as a simple idea — clothes that feel modern and personal without
              shouting for attention. Every piece is designed with young Pakistan in mind: minimal,
              confident, and made to actually be worn, not just posted.
            </p>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-black/5 py-16">
        <div className="ibee-container max-w-xl text-center">
          <h3 className="ibee-heading text-xl mb-2">Join the IBEE list</h3>
          <p className="text-sm text-black/60 mb-6">New drops, restocks, and early access. No spam.</p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
