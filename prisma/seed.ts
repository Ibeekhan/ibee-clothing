import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// NOTE: Everything below is clearly-labeled DEMO data for local development.
// Replace with real products, real photography, and a real admin password
// before going to production. Do not present this as real sales data.

async function main() {
  console.log("Seeding demo data...");

  // --- Admin user ---
  const adminPasswordHash = await bcrypt.hash("Admin@12345", 12);
  await prisma.user.upsert({
    where: { email: "admin@ibee.demo" },
    update: {},
    create: {
      email: "admin@ibee.demo",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      customer: { create: { fullName: "IBEE Admin (Demo)" } },
    },
  });

  // --- Demo customer ---
  const customerPasswordHash = await bcrypt.hash("Customer@123", 12);
  await prisma.user.upsert({
    where: { email: "customer@ibee.demo" },
    update: {},
    create: {
      email: "customer@ibee.demo",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      customer: { create: { fullName: "Demo Customer", phone: "03001234567" } },
    },
  });

  // --- Categories ---
  const categories = await Promise.all(
    ["T-Shirts", "Hoodies", "Shirts", "Bottoms"].map((name) =>
      prisma.category.upsert({
        where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
        update: {},
        create: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
      })
    )
  );
  const [tshirts, hoodies, shirts, bottoms] = categories;

  // --- Demo products (clearly labeled placeholders) ---
  const products = [
    {
      name: "IBEE Essential Tee",
      slug: "ibee-essential-tee",
      description: "[DEMO PRODUCT] A soft-cotton everyday tee with a clean, minimal IBEE mark. Placeholder copy — replace with real product description.",
      categoryId: tshirts.id,
      basePrice: 2200,
      salePrice: null,
      isFeatured: true,
      images: ["/products/essential-tee-black.jpg", "/products/essential-tee-white.jpg"],
      variants: [
        { size: "S", color: "Black", stock: 10 },
        { size: "M", color: "Black", stock: 15 },
        { size: "L", color: "Black", stock: 8 },
        { size: "XL", color: "Black", stock: 4 },
        { size: "S", color: "White", stock: 7 },
        { size: "M", color: "White", stock: 11 },
        { size: "L", color: "White", stock: 5 },
        { size: "XL", color: "White", stock: 2 },
      ],
    },
    {
      name: "IBEE Oversized Tee",
      slug: "ibee-oversized-tee",
      description: "[DEMO PRODUCT] Relaxed, oversized fit for everyday streetwear. Placeholder copy.",
      categoryId: tshirts.id,
      basePrice: 2800,
      salePrice: 2400,
      isFeatured: true,
      images: ["/products/oversized-tee-black.jpg"],
      variants: [
        { size: "M", color: "Black", stock: 12 },
        { size: "L", color: "Black", stock: 9 },
        { size: "XL", color: "Black", stock: 3 },
      ],
    },
    {
      name: "IBEE Signature Hoodie",
      slug: "ibee-signature-hoodie",
      description: "[DEMO PRODUCT] Heavyweight fleece hoodie with the IBEE signature print. Placeholder copy.",
      categoryId: hoodies.id,
      basePrice: 5500,
      salePrice: null,
      isFeatured: true,
      images: ["/products/signature-hoodie-charcoal.jpg"],
      variants: [
        { size: "S", color: "Charcoal", stock: 6 },
        { size: "M", color: "Charcoal", stock: 10 },
        { size: "L", color: "Charcoal", stock: 7 },
        { size: "XL", color: "Charcoal", stock: 0 },
      ],
    },
    {
      name: "IBEE Everyday Shirt",
      slug: "ibee-everyday-shirt",
      description: "[DEMO PRODUCT] A relaxed-fit cotton shirt for daily wear. Placeholder copy.",
      categoryId: shirts.id,
      basePrice: 3800,
      salePrice: null,
      isFeatured: false,
      images: ["/products/everyday-shirt-offwhite.jpg"],
      variants: [
        { size: "S", color: "Off-White", stock: 5 },
        { size: "M", color: "Off-White", stock: 8 },
        { size: "L", color: "Off-White", stock: 4 },
      ],
    },
    {
      name: "IBEE Cargo Pants",
      slug: "ibee-cargo-pants",
      description: "[DEMO PRODUCT] Utility cargo pants with a tapered leg. Placeholder copy.",
      categoryId: bottoms.id,
      basePrice: 4600,
      salePrice: 3900,
      isFeatured: false,
      images: ["/products/cargo-pants-black.jpg"],
      variants: [
        { size: "30", color: "Black", stock: 6 },
        { size: "32", color: "Black", stock: 9 },
        { size: "34", color: "Black", stock: 5 },
        { size: "36", color: "Black", stock: 2 },
      ],
    },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId: p.categoryId,
        basePrice: p.basePrice,
        salePrice: p.salePrice,
        isFeatured: p.isFeatured,
        images: {
          create: p.images.map((url, i) => ({ url, position: i, altText: p.name })),
        },
        variants: {
          create: p.variants.map((v) => ({
            size: v.size,
            color: v.color,
            stock: v.stock,
            sku: `${p.slug}-${v.size}-${v.color}`.toUpperCase().replace(/\s+/g, "-"),
          })),
        },
      },
    });
    console.log(`Created product: ${product.name}`);
  }

  console.log("Seeding complete.");
  console.log("Demo admin login: admin@ibee.demo / Admin@12345");
  console.log("Demo customer login: customer@ibee.demo / Customer@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
