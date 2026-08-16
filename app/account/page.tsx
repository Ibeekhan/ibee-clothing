import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/account/login");

  const customer = await prisma.customer.findUnique({
    where: { userId: session.user.id },
    include: {
      orders: { include: { items: true }, orderBy: { createdAt: "desc" } },
      addresses: true,
    },
  });

  if (!customer) redirect("/account/login");

  return (
    <div className="ibee-container py-12 max-w-3xl mx-auto">
      <h1 className="ibee-heading text-2xl mb-2">My Account</h1>
      <p className="text-black/60 mb-10">{customer.fullName} — {session.user.email}</p>

      <h2 className="ibee-eyebrow mb-4">Order History</h2>
      {customer.orders.length === 0 ? (
        <p className="text-sm text-black/60">You haven&apos;t placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {customer.orders.map((order) => (
            <div key={order.id} className="border border-[var(--color-line)] p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-black/50">{order.createdAt.toDateString()}</p>
                </div>
                <Badge tone={order.status === "DELIVERED" ? "success" : "default"}>{order.status}</Badge>
              </div>
              <p className="text-sm text-black/70">{order.items.length} item(s) — {formatPrice(Number(order.total))}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
