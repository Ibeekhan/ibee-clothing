import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

export type ProductCardData = {
  slug: string;
  name: string;
  basePrice: number;
  salePrice?: number | null;
  image: string;
  colors: string[];
  isFeatured?: boolean;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const onSale = product.salePrice && product.salePrice < product.basePrice;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] bg-black/5 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isFeatured && <Badge tone="accent">Featured</Badge>}
          {onSale && <Badge tone="error">Sale</Badge>}
        </div>
      </div>
      <div className="pt-3">
        <h3 className="text-sm font-medium">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          {onSale ? (
            <>
              <span className="text-sm font-semibold">{formatPrice(product.salePrice!)}</span>
              <span className="text-xs text-black/40 line-through">{formatPrice(product.basePrice)}</span>
            </>
          ) : (
            <span className="text-sm font-semibold">{formatPrice(product.basePrice)}</span>
          )}
        </div>
        {product.colors.length > 0 && (
          <p className="text-xs text-black/50 mt-1">{product.colors.join(" / ")}</p>
        )}
      </div>
    </Link>
  );
}
