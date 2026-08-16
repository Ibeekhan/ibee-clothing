import { prisma } from "@/lib/prisma";

// Converts Prisma's Decimal fields to plain numbers so data can be passed
// from Server Components to Client Components (Decimal objects can't cross that boundary).
function serializeProduct(product: any) {
  return {
    ...product,
    basePrice: Number(product.basePrice),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
  };
}

export async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: { images: { orderBy: { position: "asc" } }, variants: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });
  return products.map(serializeProduct);
}

export async function getNewArrivals() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { images: { orderBy: { position: "asc" } }, variants: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });
  return products.map(serializeProduct);
}

export async function getAllProducts(params: {
  category?: string;
  sort?: string;
  q?: string;
}) {
  const { category, sort, q } = params;

  const orderBy =
    sort === "price-asc"
      ? { basePrice: "asc" as const }
      : sort === "price-desc"
      ? { basePrice: "desc" as const }
      : sort === "newest"
      ? { createdAt: "desc" as const }
      : { isFeatured: "desc" as const };

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    },
    include: { images: { orderBy: { position: "asc" } }, variants: true, category: true },
    orderBy,
  });
  return products.map(serializeProduct);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: { orderBy: { position: "asc" } }, variants: true, category: true },
  });
  return product ? serializeProduct(product) : null;
}

export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}
