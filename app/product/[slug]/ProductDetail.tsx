"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/context/CartContext";
import { formatPrice, stockLabel } from "@/lib/utils";

type Variant = { id: string; size: string; color: string; stock: number; sku: string };
type ProductImage = { id: string; url: string; altText: string | null };

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  salePrice: number | null;
  images: ProductImage[];
  variants: Variant[];
};

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();

  const sizes = useMemo(() => [...new Set(product.variants.map((v) => v.size))], [product]);
  const colors = useMemo(() => [...new Set(product.variants.map((v) => v.color))], [product]);

  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [error, setError] = useState("");

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const price = product.salePrice ?? product.basePrice;
  const onSale = product.salePrice && product.salePrice < product.basePrice;

  function handleAddToCart(buyNow = false) {
    if (!selectedVariant) {
      setError("Please select a size and color.");
      return;
    }
    if (selectedVariant.stock < quantity) {
      setError("Not enough stock available for this selection.");
      return;
    }
    setError("");
    addItem({
      variantId: selectedVariant.id,
      productName: product.name,
      slug: product.slug,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price,
      image: product.images[0]?.url ?? "",
      quantity,
      maxStock: selectedVariant.stock,
    });
    if (buyNow) {
      router.push("/checkout");
    } else {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  }

  return (
    <div className="ibee-container py-12 grid md:grid-cols-2 gap-12">
      {/* GALLERY */}
      <div>
        <div className="relative aspect-[4/5] bg-black/5 mb-4">
          {product.images[activeImage] && (
            <Image
              src={product.images[activeImage].url}
              alt={product.images[activeImage].altText ?? product.name}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(i)}
                className={`relative w-20 aspect-[4/5] bg-black/5 ${i === activeImage ? "ring-2 ring-[var(--color-ink)]" : ""}`}
              >
                <Image src={img.url} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* INFO */}
      <div>
        <h1 className="ibee-heading text-3xl mb-3">{product.name}</h1>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xl font-semibold">{formatPrice(price)}</span>
          {onSale && <span className="text-black/40 line-through">{formatPrice(product.basePrice)}</span>}
        </div>

        <p className="text-sm text-black/70 leading-relaxed mb-8">{product.description}</p>

        {/* COLOR */}
        <div className="mb-6">
          <p className="ibee-eyebrow mb-3">Color: {selectedColor}</p>
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`px-4 py-2 text-sm border ${
                  selectedColor === c ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white" : "border-[var(--color-line)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* SIZE */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="ibee-eyebrow">Size</p>
            <button className="text-xs underline text-black/60">Size Guide</button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((s) => {
              const variant = product.variants.find((v) => v.size === s && v.color === selectedColor);
              const disabled = !variant || variant.stock === 0;
              return (
                <button
                  key={s}
                  disabled={disabled}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2 text-sm border disabled:opacity-30 disabled:cursor-not-allowed ${
                    selectedSize === s ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white" : "border-[var(--color-line)]"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* STOCK STATUS */}
        {selectedVariant && (
          <div className="mb-6">
            <Badge tone={stockLabel(selectedVariant.stock).tone === "out" ? "error" : stockLabel(selectedVariant.stock).tone === "low" ? "accent" : "default"}>
              {stockLabel(selectedVariant.stock).label}
            </Badge>
          </div>
        )}

        {/* QUANTITY */}
        <div className="mb-6">
          <p className="ibee-eyebrow mb-3">Quantity</p>
          <div className="flex items-center border border-[var(--color-line)] w-fit">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-4 py-2">−</button>
            <span className="px-4 text-sm">{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)} className="px-4 py-2">+</button>
          </div>
        </div>

        {error && <p className="text-sm text-[var(--color-error)] mb-4">{error}</p>}

        <div className="flex gap-3 mb-8">
          <Button
            variant="outline"
            className="flex-1"
            disabled={!selectedVariant || selectedVariant.stock === 0}
            onClick={() => handleAddToCart(false)}
          >
            {justAdded ? "Added ✓" : "Add to Cart"}
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            disabled={!selectedVariant || selectedVariant.stock === 0}
            onClick={() => handleAddToCart(true)}
          >
            Buy Now
          </Button>
        </div>

        <div className="border-t border-[var(--color-line)] pt-6 space-y-4 text-sm text-black/70">
          <details>
            <summary className="cursor-pointer font-medium text-black">Shipping Information</summary>
            <p className="mt-2">Delivered within 3–5 business days across Pakistan. Cash on Delivery available nationwide.</p>
          </details>
          <details>
            <summary className="cursor-pointer font-medium text-black">Returns</summary>
            <p className="mt-2">7-day easy returns on unworn items with tags attached.</p>
          </details>
        </div>
      </div>
    </div>
  );
}
