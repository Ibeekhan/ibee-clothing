import { prisma } from "@/lib/prisma";
import { formatPrice, stockLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { variants: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="ibee-heading text-2xl">Products</h1>
        <p className="text-xs text-black/50">
          Editing/creating products is wired to the database via Prisma — build the create/edit
          forms next by reusing the pattern in <code>app/checkout/actions.ts</code> (server actions).
        </p>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-[var(--color-line)] text-left text-black/50">
            <th className="py-3 pr-4">Product</th>
            <th className="py-3 pr-4">Category</th>
            <th className="py-3 pr-4">Price</th>
            <th className="py-3 pr-4">Total Stock</th>
            <th className="py-3 pr-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
            const stock = stockLabel(totalStock);
            return (
              <tr key={p.id} className="border-b border-[var(--color-line)]">
                <td className="py-3 pr-4 font-medium">{p.name}</td>
                <td className="py-3 pr-4 text-black/60">{p.category.name}</td>
                <td className="py-3 pr-4">{formatPrice(Number(p.salePrice ?? p.basePrice))}</td>
                <td className="py-3 pr-4">{totalStock}</td>
                <td className="py-3 pr-4">
                  <Badge tone={stock.tone === "out" ? "error" : stock.tone === "low" ? "accent" : "success"}>
                    {stock.label}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
