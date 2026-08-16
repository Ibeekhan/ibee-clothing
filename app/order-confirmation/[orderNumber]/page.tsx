import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true, address: true, customer: true },
  });

  if (!order) notFound();

  return (
    <div className="ibee-container py-16 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <p className="ibee-eyebrow text-[var(--color-success)] mb-3">Order Confirmed</p>
        <h1 className="ibee-heading text-3xl mb-2">Thank you, {order.address.fullName.split(" ")[0]}!</h1>
        <p className="text-black/60">Your order has been placed successfully.</p>
      </div>

      <div className="border border-[var(--color-line)] p-6 mb-6">
        <div className="flex justify-between text-sm mb-4">
          <span className="text-black/60">Order Number</span>
          <span className="font-semibold">{order.orderNumber}</span>
        </div>
        <div className="flex justify-between text-sm mb-4">
          <span className="text-black/60">Payment Method</span>
          <span>Cash on Delivery</span>
        </div>
        <div className="flex justify-between text-sm mb-4">
          <span className="text-black/60">Order Status</span>
          <span className="capitalize">{order.status.toLowerCase()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-black/60">Delivery Address</span>
          <span className="text-right max-w-[60%]">
            {order.address.addressLine}, {order.address.city}, {order.address.province}
          </span>
        </div>
      </div>

      <div className="border border-[var(--color-line)] p-6 mb-8">
        <p className="ibee-eyebrow mb-4">Items</p>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.productName} ({item.color}/{item.size}) × {item.quantity}</span>
              <span>{formatPrice(Number(item.priceAtPurchase) * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--color-line)] mt-4 pt-4 flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPrice(Number(order.total))}</span>
        </div>
      </div>

      <Link href="/shop">
        <Button className="w-full">Continue Shopping</Button>
      </Link>
    </div>
  );
}
