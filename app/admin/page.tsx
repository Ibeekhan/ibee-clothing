import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { SalesChart } from "./SalesChart";

export const dynamic = "force-dynamic";

async function getKpis() {
  const [revenueAgg, totalOrders, pendingOrders, deliveredOrders, totalCustomers, totalProducts, lowStockVariants] =
    await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.customer.count(),
      prisma.product.count(),
      prisma.productVariant.count({ where: { stock: { lte: 5, gt: 0 } } }),
    ]);

  const orders = await prisma.order.findMany({
    select: { createdAt: true, total: true },
    orderBy: { createdAt: "asc" },
  });

  // Group orders by day for a simple sales trend chart.
  const byDay = new Map<string, number>();
  for (const o of orders) {
    const day = o.createdAt.toISOString().slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + Number(o.total));
  }
  const chartData = Array.from(byDay.entries()).map(([date, total]) => ({ date, total }));

  return {
    revenue: Number(revenueAgg._sum.total ?? 0),
    totalOrders,
    pendingOrders,
    deliveredOrders,
    totalCustomers,
    totalProducts,
    lowStockVariants,
    chartData,
  };
}

export default async function AdminDashboard() {
  const kpis = await getKpis();

  const cards = [
    { label: "Total Revenue (Paid)", value: formatPrice(kpis.revenue) },
    { label: "Total Orders", value: kpis.totalOrders },
    { label: "Pending Orders", value: kpis.pendingOrders },
    { label: "Delivered Orders", value: kpis.deliveredOrders },
    { label: "Customers", value: kpis.totalCustomers },
    { label: "Products", value: kpis.totalProducts },
    { label: "Low Stock Variants", value: kpis.lowStockVariants },
  ];

  return (
    <div>
      <h1 className="ibee-heading text-2xl mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="border border-[var(--color-line)] p-4">
            <p className="text-xs text-black/50 mb-1">{c.label}</p>
            <p className="text-xl font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <h2 className="ibee-eyebrow mb-4">Sales Trend</h2>
      <div className="border border-[var(--color-line)] p-4">
        <SalesChart data={kpis.chartData} />
      </div>
    </div>
  );
}
