"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { PAKISTAN_PROVINCES } from "@/lib/validations/checkout";
import { placeOrder } from "./actions";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="ibee-container py-24 text-center">
        <h1 className="ibee-heading text-2xl mb-3">Nothing to check out</h1>
        <p className="text-black/60">Your cart is empty — add something from the shop first.</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return; // guards against duplicate order submission
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const cartItemsInput = items.map((i) => ({ variantId: i.variantId, quantity: i.quantity }));

    const result = await placeOrder(formData, cartItemsInput);

    if (result.success) {
      clearCart();
      router.push(`/order-confirmation/${result.orderNumber}`);
    } else {
      setError(result.error);
      setSubmitting(false);
    }
  }

  return (
    <div className="ibee-container py-12 grid md:grid-cols-[1fr_360px] gap-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="ibee-heading text-2xl mb-2">Checkout</h1>

        <div className="grid grid-cols-2 gap-4">
          <Input id="fullName" name="fullName" label="Full Name" required className="col-span-2" />
          <Input id="phone" name="phone" label="Phone Number" type="tel" required />
          <Input id="email" name="email" label="Email" type="email" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="province" className="text-xs font-medium text-[var(--color-charcoal)]">Province</label>
            <select id="province" name="province" required className="border border-[var(--color-line)] px-4 py-3 text-sm bg-white">
              <option value="">Select province</option>
              {PAKISTAN_PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <Input id="city" name="city" label="City" required />
        </div>

        <Input id="addressLine" name="addressLine" label="Full Address" required />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="notes" className="text-xs font-medium text-[var(--color-charcoal)]">Order Notes (optional)</label>
          <textarea id="notes" name="notes" rows={3} className="border border-[var(--color-line)] px-4 py-3 text-sm bg-white" />
        </div>

        <div className="border border-[var(--color-line)] p-4">
          <p className="text-sm font-medium mb-1">Payment Method</p>
          <p className="text-sm text-black/60">Cash on Delivery (COD) — pay when your order arrives.</p>
        </div>

        {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Placing Order..." : "Place Order"}
        </Button>
      </form>

      {/* ORDER SUMMARY */}
      <div className="border border-[var(--color-line)] p-6 h-fit">
        <h2 className="ibee-eyebrow mb-4">Order Summary</h2>
        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div key={item.variantId} className="flex justify-between text-sm">
              <span className="text-black/70">{item.productName} ({item.color}/{item.size}) × {item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--color-line)] pt-4 flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}
