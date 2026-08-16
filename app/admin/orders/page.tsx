import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { updateOrderStatus } from "./actions";

export const dynamic = "force-dynamic";

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { customer: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="ibee-heading text-2xl mb-8">Orders</h1>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-[var(--color-line)] text-left text-black/50">
            <th className="py-3 pr-4">Order #</th>
            <th className="py-3 pr-4">Customer</th>
            <th className="py-3 pr-4">Items</th>
            <th className="py-3 pr-4">Total</th>
            <th className="py-3 pr-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-[var(--color-line)]">
              <td className="py-3 pr-4 font-medium">{order.orderNumber}</td>
              <td className="py-3 pr-4">{order.customer.fullName}</td>
              <td className="py-3 pr-4">{order.items.length}</td>
              <td className="py-3 pr-4">{formatPrice(Number(order.total))}</td>
              <td className="py-3 pr-4">
                <form action={updateOrderStatus} className="inline">
                  <input type="hidden" name="orderId" value={order.id} />
                  <select
                    name="status"
                    defaultValue={order.status}
                    onChange={(e) => e.currentTarget.form?.requestSubmit()}
                    className="border border-[var(--color-line)] text-xs px-2 py-1 bg-white"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
